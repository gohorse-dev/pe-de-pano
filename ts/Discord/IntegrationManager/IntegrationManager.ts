import { ApplicationParameters } from '@gohorse/npm-application';
import { InvalidExecutionError, Message } from '@sergiocabral/helper';
import { ApplicationReady } from '../../App/Message/ApplicationReady';
import * as fs from 'node:fs';
import path from 'node:path';
import { InteractionHandlerConstructor } from '../Interaction/InteractionHandler';
import { IInteractionHandler } from '../Interaction/IInteractionHandler';

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

  /**
   * Carrega todas as interações.
   */
  private async loadInteractions(): Promise<number> {
    if (this.interactions.length !== 0) {
      throw new InvalidExecutionError('Interactions already loaded.');
    }

    const pathOfInteractions = path.join(
      __dirname,
      '..',
      'Interaction',
      'Implementation'
    );
    const allfiles = fs.readdirSync(pathOfInteractions);
    const javascriptFiles = allfiles.filter(file => file.endsWith('.js'));
    const typescriptFiles =
      javascriptFiles.length === 0
        ? allfiles.filter(file => file.endsWith('.ts'))
        : [];
    const interactionFiles =
      javascriptFiles.length > 0 ? javascriptFiles : typescriptFiles;

    for (const interactionFile of interactionFiles) {
      const interactionFilePath = path.join(
        pathOfInteractions,
        interactionFile
      );
      const interactionModule = (await import(interactionFilePath)) as Record<
        string,
        unknown
      >;
      const interactionClassConstructor = Object.values(
        interactionModule
      )[0] as InteractionHandlerConstructor;
      this.interactions.push(
        new interactionClassConstructor({
          applicationParameters: this.applicationParameters
        })
      );
    }

    // TODO: Incluir logs.

    console.log(this.interactions);

    return this.interactions.length;
  }
}
