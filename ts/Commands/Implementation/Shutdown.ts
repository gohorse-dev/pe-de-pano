import { Command } from '../Command';
import {
  ActionRowBuilder,
  ButtonBuilder,
  CommandInteraction,
  ButtonStyle
} from 'discord.js';
import { TerminateApplication } from '@gohorse/npm-core';

/**
 * Desliga o bot como aplição em execução no sistema operacional.
 */
export class Shutdown extends Command {
  /**
   * Nome.
   */
  public override name = 'shutdown';

  /**
   * Descrição.
   */
  public description = 'Turn off this bot.'.translate();

  /**
   * Executa o comando.
   * @param interaction Interação chegada do discord.
   */
  public override async run(interaction: CommandInteraction): Promise<void> {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('no')
        .setLabel('No. It was just a joke.'.translate())
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('yes')
        .setLabel('Yes. You deserve it.'.translate())
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({
      content: 'You intend to kill me, is that it?'.translate(),
      components: [row]
    });

    return;

    await new TerminateApplication(
      this.configuration.applicationParameters.id,
      this.configuration.applicationParameters.id
    ).sendAsync();
  }
}
