import { ApplicationParameters } from '@gohorse/npm-application';
import {
  HelperFileSystem,
  HelperText,
  InvalidExecutionError,
  Message,
  ShouldNeverHappenError
} from '@sergiocabral/helper';
import { ApplicationReady } from '../../App/Message/ApplicationReady';
import { InteractionHandler } from '../Interaction/InteractionHandler';
import { IInteractionHandler } from '../Interaction/IInteractionHandler';
import { InteractionHandlerConfiguration } from '../Interaction/InteractionHandlerConfiguration';

/**
 * Responsável pela gerência das interações com o Discord.
 */
export class IntegrationManager {
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
  private interactions: IInteractionHandler[] = [];

  /**
   * Inscrição nas mensagens.
   */
  private subscribeToMessages(): void {
    Message.subscribe(ApplicationReady, this.handleApplicationReady.bind(this));
  }

  /**
   * Mensagem: ApplicationReady
   */
  private async handleApplicationReady(): Promise<void> {
    await this.loadInteractions();
  }

  // TODO: Incluir logs.

  /**
   * Carrega todas as interações.
   */
  private async loadInteractions(): Promise<number> {
    if (this.interactions.length !== 0) {
      throw new InvalidExecutionError('Interactions already loaded.');
    }

    for (const interactionFile of this.getInteractionFiles()) {
      const interaction = await this.loadInteraction(interactionFile);
      if (interaction !== undefined) {
        this.interactions.push(interaction);
      }
    }

    return this.interactions.length;
  }

  /**
   * Carrega uma interação.
   * @param interactionFilePath Caminho do arquivo do código-fonte da interação.
   */
  private async loadInteraction(
    interactionFilePath: string
  ): Promise<InteractionHandler | undefined> {
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
      interactionModule = (await import(interactionFilePath)) as Record<
        string,
        new (...args: unknown[]) => unknown
      >;
    } catch (error) {
      return undefined;
    }

    const interactionClassConstructor = interactionModule[interactionName];

    if (typeof interactionClassConstructor !== 'function') {
      return undefined;
    }

    const configuration: InteractionHandlerConfiguration = {
      applicationParameters: this.applicationParameters
    };

    const interaction = new interactionClassConstructor(configuration);

    if (!(interaction instanceof InteractionHandler)) {
      return undefined;
    }

    return interaction;
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
    return HelperFileSystem.findFilesInto(
      this.applicationParameters.packageDirectory,
      regexInteractionFiles,
      undefined,
      'node_modules'
    );
  }
}
