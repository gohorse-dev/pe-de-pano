import { InteractionHandler } from '../InteractionHandler';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Interaction
} from 'discord.js';
import { TerminateApplication } from '@gohorse/npm-core';
import { ICommandInteractionHandler } from '../ICommandInteractionHandler';

/**
 * Desliga o bot como aplição em execução no sistema operacional.
 */
export class Shutdown
  extends InteractionHandler
  implements ICommandInteractionHandler
{
  /**
   * Nome.
   */
  public name = 'shutdown';

  /**
   * Descrição.
   */
  public description = 'Turn off this bot.'.translate();

  /**
   * Verifica se é uma interação possível de ser executada.
   * @param interaction Interação chegada do discord.
   */
  public canRun(interaction: Interaction): boolean {
    return interaction.isCommand() && interaction.commandName === this.name;
  }

  /**
   * Executa o comando.
   * @param interaction Interação chegada do discord.
   */
  public override async run(interaction: Interaction): Promise<void> {
    if (!interaction.isCommand()) {
      return;
    }

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
