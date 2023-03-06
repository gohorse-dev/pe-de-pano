import { Interaction, InteractionResponse } from 'discord.js';
import { ApplicationInteractionInstanceStep } from '../../ApplicationInteractionInstanceStep';
import { Instance, TerminateApplication } from '@gohorse/npm-core';
import { ShutdownInteractionInstanceMemory } from './ShutdownInteractionInstanceMemory';
import { ShouldNeverHappenError } from '@sergiocabral/helper';

/**
 * Resposta Sim para a pergunta de confirmação.
 * Desliga o bot como aplição em execução no sistema operacional.
 */
export class ShutdownInteractionStepAnswerYes extends ApplicationInteractionInstanceStep<ShutdownInteractionInstanceMemory> {
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

    // await discordInteraction.deleteReply();

    await new TerminateApplication(Instance.id, Instance.id).sendAsync();

    return discordInteraction.reply({
      content: "I'm going, but I'll be back.".translate(),
      ephemeral: true
    });
  }
}
