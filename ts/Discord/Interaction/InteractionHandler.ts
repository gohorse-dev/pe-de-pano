import { IInteractionHandler } from './IInteractionHandler';
import { Interaction } from 'discord.js';
import { InteractionHandlerConfiguration } from './InteractionHandlerConfiguration';
import { DiscordInteractionReceived } from '../Message/DiscordInteractionReceived';
import { HelperText, Logger, LogLevel, Message } from '@sergiocabral/helper';

/**
 * Representa um tratamento de interação com o Discord.
 */
export abstract class InteractionHandler implements IInteractionHandler {
  /**
   * Contexto de log.
   * @private
   */
  private static logContext2 = 'InteractionHandler';

  /**
   * Construtor.
   * @param configuration Configurações usadas na construção de um comando.
   */
  public constructor(
    protected readonly configuration: InteractionHandlerConfiguration
  ) {
    Message.subscribe(
      DiscordInteractionReceived,
      this.handleDiscordInteractionReceived.bind(this)
    );
  }

  /**
   * Verifica se é uma interação possível de ser executada.
   * @param interaction Interação chegada do discord.
   */
  public abstract canRun(interaction: Interaction): boolean;

  /**
   * Executa o comando.
   * @param interaction Interação chegada do discord.
   */
  public abstract run(interaction: Interaction): Promise<void>;

  /**
   * Mensagem: DiscordInteractionReceived
   */
  private async handleDiscordInteractionReceived(
    message: DiscordInteractionReceived
  ): Promise<void> {
    const discordInteraction = message.interaction;

    if (!this.canRun(discordInteraction)) {
      return;
    }

    try {
      Logger.post(
        'Executing interaction "{interactionName}".',
        {
          interactionName: this.constructor.name
        },
        LogLevel.Verbose,
        InteractionHandler.logContext2
      );

      await this.run(discordInteraction);

      Logger.post(
        'Interaction "{interactionName}" executed successfuly.',
        {
          interactionName: this.constructor.name
        },
        LogLevel.Debug,
        InteractionHandler.logContext2
      );
    } catch (error) {
      Logger.post(
        'Error executing interaction "{interactionName}": {errorDescription}',
        {
          interactionName: this.constructor.name,
          errorDescription: HelperText.formatError(error),
          error
        },
        LogLevel.Error,
        InteractionHandler.logContext2
      );
    }
  }
}
