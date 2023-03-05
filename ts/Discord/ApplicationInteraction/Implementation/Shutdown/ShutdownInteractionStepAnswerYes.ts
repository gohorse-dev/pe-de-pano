import { Interaction } from 'discord.js';
import { ApplicationInteractionInstanceStep } from '../../ApplicationInteractionInstanceStep';
import { Instance, TerminateApplication } from '@gohorse/npm-core';
import { ShutdownInteractionInstanceMemory } from './ShutdownInteractionInstanceMemory';

/**
 * Desliga o bot como aplição em execução no sistema operacional.
 */
export class ShutdownInteractionStepAnswerYes extends ApplicationInteractionInstanceStep<ShutdownInteractionInstanceMemory> {
  /**
   * Trata a interação.
   * @param interaction Interação chegada do discord.
   */
  public override async handle(interaction: Interaction): Promise<void> {
    if (interaction.isRepliable()) {
      await interaction.reply({
        content: "I'll be back.".translate(),
        ephemeral: true
      });
      await new TerminateApplication(Instance.id, Instance.id).sendAsync();
    }
  }
}
