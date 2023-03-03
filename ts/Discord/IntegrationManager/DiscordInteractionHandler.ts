import { Logger, LogLevel, Message } from '@sergiocabral/helper';
import { DiscordClientConnected } from '../Message/DiscordClientConnected';
import { Events, Interaction } from 'discord.js';
import { DiscordClientDisconnected } from '../Message/DiscordClientDisconnected';
import { DiscordInteractionReceived } from '../Message/DiscordInteractionReceived';

/**
 * Responsável por capturar as interações vindas do Discord.
 */
export class DiscordInteractionHandler {
  /**
   * Contexto do log.
   */
  private static logContext = 'InteractionHandler';

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
      'Received Discord interaction message with id "{interactionId}".',
      {
        interactionId: interaction.id
      },
      LogLevel.Verbose,
      DiscordInteractionHandler.logContext
    );

    await new DiscordInteractionReceived(interaction).sendAsync();
  }
}
