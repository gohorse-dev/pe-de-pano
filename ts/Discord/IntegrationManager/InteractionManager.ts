import { Logger, LogLevel, Message } from '@sergiocabral/helper';
import { DiscordClientConnected } from '../Message/DiscordClientConnected';
import { Events, Interaction } from 'discord.js';
import { DiscordClientDisconnected } from '../Message/DiscordClientDisconnected';
import { DiscordInteractionReceived } from '../Message/DiscordInteractionReceived';

/**
 * Responsável pelas interações com o Discord.
 */
export class InteractionManager {
  /**
   * Contexto do log.
   */
  private static logContext = 'InteractionManager';

  /**
   * Construtor.
   */
  public constructor() {
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
}
