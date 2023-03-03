import { ApplicationParameters } from '@gohorse/npm-application';
import {
  HelperFileSystem,
  HelperText,
  InvalidExecutionError,
  Logger,
  LogLevel,
  Message,
  ShouldNeverHappenError
} from '@sergiocabral/helper';
import { ApplicationReady } from '../../App/Message/ApplicationReady';
import { InteractionBase } from '../Interaction/InteractionBase';
import { InteractionBaseConfiguration } from '../Interaction/InteractionBaseConfiguration';
import { InteractionsLoaded } from '../Message/InteractionsLoaded';
import { IInteractionBase } from '../Interaction/IInteractionBase';
import { GetInteractions } from '../Message/GetInteractions';

/**
 * Carrega as interações da aplicação dinamicamente.
 */
export class ApplicationInteractionLoader {
  /**
   * Contexto de log.
   */
  private static logContext = 'InteractionLoader';

  /**
   * Construtor.
   * @param applicationParameters Parâmetros da aplicação.
   */
  public constructor(
    private readonly applicationParameters: ApplicationParameters
  ) {
    this.subscribeToMessages();
  }

  /**
   * Interações disponíveis e carregadas.
   */
  private interactions: IInteractionBase[] = [];

  /**
   * Inscrição nas mensagens.
   */
  private subscribeToMessages(): void {
    Message.subscribe(ApplicationReady, this.handleApplicationReady.bind(this));
    Message.subscribe(GetInteractions, this.handleGetInteractions.bind(this));
  }

  /**
   * Mensagem: ApplicationReady
   */
  private async handleApplicationReady(): Promise<void> {
    await this.loadInteractions();
  }

  /**
   * Mensagem: GetInteractions
   */
  private handleGetInteractions(message: GetInteractions): void {
    message.interactions = Array<IInteractionBase>().concat(this.interactions);
  }

  /**
   * Carrega todas as interações.
   */
  private async loadInteractions(): Promise<number> {
    if (this.interactions.length !== 0) {
      throw new InvalidExecutionError('Interactions already loaded.');
    }

    Logger.post(
      'Loading interactions with the Discord API.',
      undefined,
      LogLevel.Verbose,
      ApplicationInteractionLoader.logContext
    );

    for (const interactionFile of this.getInteractionFiles()) {
      const interaction = await this.loadInteraction(interactionFile);
      if (interaction !== undefined) {
        this.interactions.push(interaction);
      }
    }

    Logger.post(
      'Total Discord API interactions loaded: {interactionCount}',
      { interactionCount: this.interactions.length },
      LogLevel.Debug,
      ApplicationInteractionLoader.logContext
    );

    await new InteractionsLoaded(
      Array<IInteractionBase>().concat(this.interactions)
    ).sendAsync();

    return this.interactions.length;
  }

  /**
   * Carrega uma interação.
   * @param interactionFilePath Caminho do arquivo do código-fonte da interação.
   */
  private async loadInteraction(
    interactionFilePath: string
  ): Promise<IInteractionBase | undefined> {
    const regexInteractionName = /[^\\/]+(?=\.[^.]+)/;
    const interactionName = (interactionFilePath.match(regexInteractionName) ??
      [])[0];

    if (interactionName === undefined) {
      throw new ShouldNeverHappenError(
        'Invalid RegExp to extract file name without extnesion.'
      );
    }

    let interactionModule: Record<string, new (...args: unknown[]) => unknown>;
    try {
      Logger.post(
        'Trying to load Discord API interaction file: "{interactionFilePath}"',
        {
          interactionFilePath
        },
        LogLevel.Verbose,
        ApplicationInteractionLoader.logContext
      );

      interactionModule = (await import(interactionFilePath)) as Record<
        string,
        new (...args: unknown[]) => unknown
      >;

      Logger.post(
        'Discord API interaction file loaded successfully: "{interactionFilePath}"',
        {
          interactionFilePath
        },
        LogLevel.Verbose,
        ApplicationInteractionLoader.logContext
      );
    } catch (error) {
      Logger.post(
        'Error loading Discord API interaction file: {errorDescription}',
        () => ({
          errorDescription: HelperText.formatError(error),
          error
        }),
        LogLevel.Error,
        ApplicationInteractionLoader.logContext
      );

      return undefined;
    }

    const interactionClassConstructor = interactionModule[interactionName];

    if (typeof interactionClassConstructor !== 'function') {
      Logger.post(
        'The Discord API interaction class was not found in the corresponding file: "{interactionFilePath}"',
        {
          interactionFilePath
        },
        LogLevel.Error,
        ApplicationInteractionLoader.logContext
      );

      return undefined;
    }

    const configuration: InteractionBaseConfiguration = {
      applicationParameters: this.applicationParameters
    };

    const interaction = new interactionClassConstructor(configuration);

    if (!(interaction instanceof InteractionBase)) {
      Logger.post(
        'The type of the Discord API interaction class is incorrect in the corresponding file: "{interactionFilePath}"',
        {
          interactionFilePath
        },
        LogLevel.Error,
        ApplicationInteractionLoader.logContext
      );

      return undefined;
    }

    return interaction as IInteractionBase;
  }

  /**
   * Retorna a lista de arquivos das interações.
   */
  private getInteractionFiles(): string[] {
    const regexFileExtension = /\.[^.]+$/;
    const extension = (__filename.match(regexFileExtension) ?? [''])[0];
    const regexInteractionFiles = new RegExp(
      '.+' + HelperText.escapeRegExp('Interaction' + extension) + '$'
    );

    const interactionBasePath = this.applicationParameters.packageDirectory;

    Logger.post(
      'Recursively looking for Discord API interactions files in directory: "{interactionBasePath}"',
      {
        interactionBasePath
      },
      LogLevel.Verbose,
      ApplicationInteractionLoader.logContext
    );

    try {
      const files = HelperFileSystem.findFilesInto(
        interactionBasePath,
        regexInteractionFiles,
        undefined,
        'node_modules'
      );

      Logger.post(
        'Discord API interactions files found: {interactionCount}, {interactionFileList}',
        () => ({
          interactionCount: files.length,
          interactionFileList: files.map(file => `"${file}"`).join(', '),
          interactionList: files
        }),
        LogLevel.Debug,
        ApplicationInteractionLoader.logContext
      );

      return files;
    } catch (error) {
      Logger.post(
        'Error when looking for Discord API interactions files: {errorDescription}',
        () => ({
          errorDescription: HelperText.formatError(error),
          error
        }),
        LogLevel.Error,
        ApplicationInteractionLoader.logContext
      );

      return [];
    }
  }
}
