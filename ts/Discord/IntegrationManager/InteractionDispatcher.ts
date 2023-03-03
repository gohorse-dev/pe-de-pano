import { HelperText, Logger, LogLevel, Message } from '@sergiocabral/helper';
import { DiscordInteractionReceived } from '../Message/DiscordInteractionReceived';
import { IApplicationInteraction } from '../Interaction/IApplicationInteraction';
import { InteractionsLoaded } from '../Message/InteractionsLoaded';

/**
 * Recebe interações do Discord e despacha para a aplicação tratar.
 */
export class InteractionDispatcher {
  /**
   * Contexto de log.
   */
  private static logContext = 'IntegrationManager';

  /**
   * Construtor.
   */
  public constructor() {
    this.subscribeToMessages();
  }

  /**
   * Interações disponíveis.
   */
  private interactions: IApplicationInteraction[] = [];

  /**
   * Inscrição nas mensagens.
   */
  private subscribeToMessages(): void {
    Message.subscribe(
      InteractionsLoaded,
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
  private handleInteractionsLoaded(message: InteractionsLoaded): void {
    this.interactions = Array<IApplicationInteraction>().concat(
      message.interactions
    );
  }

  /**
   * Mensagem: DiscordInteractionReceived
   */
  private async handleDiscordInteractionReceived(
    message: DiscordInteractionReceived
  ): Promise<void> {
    const discordInteraction = message.interaction;

    const interactions = this.interactions.filter(interaction =>
      interaction.canHandle(discordInteraction)
    );

    if (interactions.length > 0) {
      Logger.post(
        'Discord interaction message with id "{interactionId}" will be handled by: {interactionNameList}',
        {
          interactionId: discordInteraction.id,
          interactionNameList: interactions.map(
            interaction => interaction.constructor.name
          )
        },
        LogLevel.Verbose,
        InteractionDispatcher.logContext
      );

      for (const interaction of interactions) {
        try {
          await interaction.handle(message.interaction);

          Logger.post(
            'Discord interaction message with id "{interactionId}" was successfully handled by "{interactionName}".',
            {
              interactionId: discordInteraction.id,
              interactionName: interaction.constructor.name
            },
            LogLevel.Debug,
            InteractionDispatcher.logContext
          );
        } catch (error) {
          Logger.post(
            'An error occurred while handling a Discord interaction message with id "{interactionId}" by "{interactionName}": {errorDescription}',
            () => ({
              interactionId: discordInteraction.id,
              interactionName: interaction.constructor.name,
              errorDescription: HelperText.formatError(error),
              error
            }),
            LogLevel.Error,
            InteractionDispatcher.logContext
          );
        }
      }
    }
  }
}
