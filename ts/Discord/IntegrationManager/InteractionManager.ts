import { Logger, LogLevel, Message } from '@sergiocabral/helper';
import { DiscordClientConnected } from '../Message/DiscordClientConnected';
import { Events, Interaction } from 'discord.js';
import { DiscordClientDisconnected } from '../Message/DiscordClientDisconnected';
import { DiscordInteractionReceived } from '../Message/DiscordInteractionReceived';
import { InteractionHandlerConfiguration } from '../Interaction/InteractionHandlerConfiguration';
import { IInteractionHandler } from '../Interaction/IInteractionHandler';
import { Ping } from '../Interaction/Implementation/Ping';
import { Hello } from '../Interaction/Implementation/Hello';
import { Shutdown } from '../Interaction/Implementation/Shutdown';
import { DominosPizzaPrice } from '../Interaction/Implementation/DominosPizzaPrice';
import { ApplicationParameters } from '@gohorse/npm-application';
import { GetAllInteractions } from '../Message/GetAllInteractions';

/**
 * Responsável pelas interações com o Discord.
 */
export class InteractionManager {
  /**
   * Contexto do log.
   */
  private static logContext = 'InteractionManager';

  /**
   * Lista de todos os construtores de interações com o Discord.
   */
  public static allInteractionsConstructors: Array<
    new (configuration: InteractionHandlerConfiguration) => IInteractionHandler
  > = [Ping, Hello, Shutdown, DominosPizzaPrice];

  /**
   * Lista de todas as instâncias de interações com o Discord.
   */
  public allInteractions: Array<IInteractionHandler>;

  /**
   * Construtor.
   * @param applicationParameters Parâmetros da aplição.
   */
  public constructor(
    private readonly applicationParameters: ApplicationParameters
  ) {
    this.allInteractions = this.createInteractionHandlers();

    Message.subscribe(
      GetAllInteractions,
      this.handleGetAllInteractions.bind(this)
    );
    Message.subscribe(
      DiscordClientConnected,
      this.handleDiscordClientConnected.bind(this)
    );
    Message.subscribe(
      DiscordClientDisconnected,
      this.handleDiscordClientDisconnected.bind(this)
    );
  }

  /**
   * Mensagem: GetAllInteractions
   */
  private handleGetAllInteractions(message: GetAllInteractions): void {
    message.allInteractions = this.allInteractions;
  }

  /**
   * Mensagem: DiscordClientConnected
   */
  private handleDiscordClientConnected(message: DiscordClientConnected): void {
    message.client.on(
      Events.InteractionCreate,
      this.dispatchInteraction.bind(this)
    );
  }

  /**
   * Mensagem: DiscordClientConnected
   */
  private handleDiscordClientDisconnected(
    message: DiscordClientDisconnected
  ): void {
    message.client.off(
      Events.InteractionCreate,
      this.dispatchInteraction.bind(this)
    );
  }

  /**
   * Despacha uma interação.
   * @param interaction
   */
  private async dispatchInteraction(interaction: Interaction): Promise<void> {
    Logger.post(
      'Received Message interaction with id "{interactionId}".',
      {
        interactionId: interaction.id
      },
      LogLevel.Debug,
      InteractionManager.logContext
    );

    await new DiscordInteractionReceived(interaction).sendAsync();
  }

  /**
   * Cria as instâncias das interações possíveis.
   */
  private createInteractionHandlers(): IInteractionHandler[] {
    return InteractionManager.allInteractionsConstructors.map(
      interactionConstructor =>
        new interactionConstructor({
          applicationParameters: this.applicationParameters
        })
    );
  }
}
