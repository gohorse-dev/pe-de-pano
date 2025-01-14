import { HelperText, Logger, LogLevel, Message } from '@sergiocabral/helper';
import { DiscordInteractionReceived } from '../Message/DiscordInteractionReceived';
import { ApplicationInteraction } from '../ApplicationInteraction/ApplicationInteraction';
import { ApplicationInteractionsLoaded } from '../Message/ApplicationInteractionsLoaded';

/**
 * Recebe interações do Discord e despacha para a aplicação tratar.
 */
export class ApplicationInteractionDispatcher {
  /**
   * Contexto de log.
   */
  private static logContext = 'ApplicationInteractionDispatcher';

  /**
   * Construtor.
   */
  public constructor() {
    this.subscribeToMessages();
  }

  /**
   * Interações disponíveis.
   */
  private interactions: ApplicationInteraction[] = [];

  /**
   * Inscrição nas mensagens.
   */
  private subscribeToMessages(): void {
    Message.subscribe(
      ApplicationInteractionsLoaded,
      this.handleInteractionsLoaded.bind(this)
    );
    Message.subscribe(
      DiscordInteractionReceived,
      this.handleDiscordInteractionReceived.bind(this)
    );
  }

  /**
   * Mensagem: DiscordInteractionReceived
   */
  private handleInteractionsLoaded(
    message: ApplicationInteractionsLoaded
  ): void {
    this.interactions = Array<ApplicationInteraction>().concat(
      message.interactions
    );
  }

  /**
   * Mensagem: DiscordInteractionReceived
   */
  private async handleDiscordInteractionReceived(
    message: DiscordInteractionReceived
  ): Promise<void> {
    const discordInteraction = message.discordInteraction;

    const capableIinteractions: ApplicationInteraction[] = [];
    for (const interaction of this.interactions) {
      if (await interaction.canHandle(discordInteraction)) {
        capableIinteractions.push(interaction);
      }
    }

    if (capableIinteractions.length > 0) {
      Logger.post(
        'Discord interaction message with id "{discordInteractionId}" will be handled by: {applicationInteractionNameList}',
        () => ({
          discordInteractionId: discordInteraction.id,
          applicationInteractionNameList: capableIinteractions.map(
            interaction => interaction.constructor.name
          )
        }),
        LogLevel.Verbose,
        ApplicationInteractionDispatcher.logContext
      );

      for (const interaction of capableIinteractions) {
        try {
          await interaction.handle(message.discordInteraction);

          Logger.post(
            'Discord interaction message with id "{discordInteractionId}" was successfully handled by "{applicationInteractionName}".',
            {
              discordInteractionId: discordInteraction.id,
              applicationInteractionName: interaction.constructor.name
            },
            LogLevel.Debug,
            ApplicationInteractionDispatcher.logContext
          );
        } catch (error) {
          Logger.post(
            'An error occurred while handling a Discord interaction message with id "{discordInteractionId}" by "{applicationInteractionName}": {errorDescription}',
            () => ({
              discordInteractionId: discordInteraction.id,
              applicationInteractionName: interaction.constructor.name,
              errorDescription: HelperText.formatError(error),
              error
            }),
            LogLevel.Error,
            ApplicationInteractionDispatcher.logContext
          );
        }
      }
    }
  }
}
