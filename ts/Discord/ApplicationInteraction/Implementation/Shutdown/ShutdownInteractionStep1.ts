import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Interaction
} from 'discord.js';
import { ApplicationInteractionInstanceStep } from '../../ApplicationInteractionInstanceStep';
import { ShutdownInteractionInstanceMemory } from './ShutdownInteractionInstanceMemory';

/**
 * Desliga o bot como aplição em execução no sistema operacional.
 */
export class ShutdownInteractionStep1 extends ApplicationInteractionInstanceStep<ShutdownInteractionInstanceMemory> {
  /**
   * Botáo Sim: Instância
   */
  private buttonYes: ButtonBuilder = new ButtonBuilder()
    .setCustomId(
      `${this.id}|${this.applicationInteractionInstance.memory.buttonYesId}`
    )
    .setLabel('Yes. You deserve it.'.translate())
    .setStyle(ButtonStyle.Danger);

  /**
   * Botáo Não: Instância
   */
  private buttonNo: ButtonBuilder = new ButtonBuilder()
    .setCustomId(
      `${this.id}|${this.applicationInteractionInstance.memory.buttonNoId}`
    )
    .setLabel('No. It was just a joke.'.translate())
    .setStyle(ButtonStyle.Primary);

  /**
   * Trata a interação.
   * @param interaction Interação chegada do discord.
   */
  public override async handle(interaction: Interaction): Promise<void> {
    if (interaction.isCommand()) {
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        this.buttonNo,
        this.buttonYes
      );

      await interaction.reply({
        content: 'You intend to kill me, is that it?'.translate(),
        components: [row],
        ephemeral: true
      });
    }
  }
}
