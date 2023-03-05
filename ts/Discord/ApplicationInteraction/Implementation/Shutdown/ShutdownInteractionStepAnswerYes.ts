import { Interaction } from 'discord.js';
import { ApplicationInteractionInstanceStep } from '../../ApplicationInteractionInstanceStep';
import { Instance, TerminateApplication } from '@gohorse/npm-core';
import { ShutdownInteractionInstanceMemory } from './ShutdownInteractionInstanceMemory';

/**
 * Resposta Sim para a pergunta de confirmação.
 * Desliga o bot como aplição em execução no sistema operacional.
 */
export class ShutdownInteractionStepAnswerYes extends ApplicationInteractionInstanceStep<ShutdownInteractionInstanceMemory> {
  /**
   * Trata a interação do Discord.
   * @param discordInteraction Interação do Discord.
   */
  public override async handle(discordInteraction: Interaction): Promise<void> {
    if (discordInteraction.isRepliable()) {
      await discordInteraction.reply({
        content: "I'm going, but I'll be back.".translate(),
        ephemeral: true
      });
      await new TerminateApplication(Instance.id, Instance.id).sendAsync();
    }
  }
}
