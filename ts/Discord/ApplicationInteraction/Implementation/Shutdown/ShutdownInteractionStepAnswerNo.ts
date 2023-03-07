import { Interaction, InteractionResponse } from 'discord.js';
import { ApplicationInteractionInstanceStep } from '../../ApplicationInteractionInstanceStep';
import { ShutdownInteractionInstanceMemory } from './ShutdownInteractionInstanceMemory';
import { ShouldNeverHappenError } from '@sergiocabral/helper';

/**
 * Resposta Não para a pergunta de confirmação.
 * Desliga o bot como aplição em execução no sistema operacional.
 */
export class ShutdownInteractionStepAnswerNo extends ApplicationInteractionInstanceStep<ShutdownInteractionInstanceMemory> {
  /**
   * Trata a interação do Discord.
   * @param discordInteraction Interação do Discord.
   */
  protected override async doHandle(
    discordInteraction: Interaction
  ): Promise<InteractionResponse> {
    if (!discordInteraction.isRepliable()) {
      throw new ShouldNeverHappenError(
        'Expected a Discord interaction as replieable.'
      );
    }

    const lastDiscordInteraction =
      this.applicationInteractionInstance.discordInteractions.last();
    if (lastDiscordInteraction?.isMessageComponent()) {
      await lastDiscordInteraction.deleteReply();
    }

    void this.applicationInteractionInstance.dispose();

    return discordInteraction.reply({
      content: 'Phew! What a fright.'.translate(),
      ephemeral: true
    });
  }
}
