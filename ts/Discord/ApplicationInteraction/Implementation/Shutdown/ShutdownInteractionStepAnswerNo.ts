import { Interaction } from 'discord.js';
import { ApplicationInteractionInstanceStep } from '../../ApplicationInteractionInstanceStep';
import { ShutdownInteractionInstanceMemory } from './ShutdownInteractionInstanceMemory';

/**
 * Desliga o bot como aplição em execução no sistema operacional.
 */
export class ShutdownInteractionStepAnswerNo extends ApplicationInteractionInstanceStep<ShutdownInteractionInstanceMemory> {
  /**
   * Trata a interação.
   * @param interaction Interação chegada do discord.
   */
  public override async handle(interaction: Interaction): Promise<void> {
    if (interaction.isRepliable()) {
      await interaction.reply({
        content: 'Phew! What a fright.'.translate(),
        ephemeral: true
      });
    }
  }
}
