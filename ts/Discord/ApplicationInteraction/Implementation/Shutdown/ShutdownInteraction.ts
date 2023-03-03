import { ApplicationInteraction } from '../../ApplicationInteraction';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  Interaction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction
} from 'discord.js';
import { TerminateApplication } from '@gohorse/npm-core';
import { ICommandInteractionHandler } from '../../ICommandInteractionHandler';
import { NotImplementedError } from '@sergiocabral/helper';

/**
 * Desliga o bot como aplição em execução no sistema operacional.
 */
export class ShutdownInteraction
  extends ApplicationInteraction
  implements ICommandInteractionHandler
{
  /**
   * Nome.
   */
  public commandName = 'shutdown';

  /**
   * Descrição.
   */
  public commandDescription = 'Turn off this bot.'.translate();

  /**
   * Verifica se é uma interação possível de ser executada.
   * @param interaction Interação chegada do discord.
   */
  public canRun(interaction: Interaction): boolean {
    return this.isStep1(interaction) || this.isStep2(interaction);
  }

  /**
   * Executa o comando.
   * @param interaction Interação chegada do discord.
   */
  public override async run(interaction: Interaction): Promise<void> {
    if (this.isStep1(interaction)) {
      await this.step1(interaction);
    } else if (this.isStep2(interaction)) {
      await this.step2(interaction);
    } else {
      throw new NotImplementedError(
        `Invalid execution for interaction "${this.constructor.name}".`
      );
    }
  }

  /**
   * Botáo Sim: Id
   */
  private buttonYesId = Math.random().toString();

  /**
   * Botáo Sim: Instância
   */
  private buttonYes: ButtonBuilder = new ButtonBuilder()
    .setCustomId(this.buttonYesId)
    .setLabel('Yes. You deserve it.'.translate())
    .setStyle(ButtonStyle.Danger);

  /**
   * Botáo Não: Id
   */
  private buttonNoId = Math.random().toString();

  /**
   * Botáo Não: Instância
   */
  private buttonNo: ButtonBuilder = new ButtonBuilder()
    .setCustomId(this.buttonNoId)
    .setLabel('No. It was just a joke.'.translate())
    .setStyle(ButtonStyle.Primary);

  /**
   * Passo 1: checagem.
   */
  private isStep1(
    interaction: Interaction
  ): interaction is
    | ChatInputCommandInteraction
    | MessageContextMenuCommandInteraction
    | UserContextMenuCommandInteraction {
    return (
      interaction.isCommand() && interaction.commandName === this.commandName
    );
  }

  /**
   * Passo 1: execução.
   */
  private async step1(interaction: Interaction): Promise<void> {
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

  /**
   * Passo 1: checagem.
   */
  private isStep2(interaction: Interaction): interaction is ButtonInteraction {
    return Boolean(
      interaction.isButton() &&
        [this.buttonYesId, this.buttonNoId].includes(interaction.customId)
    );
  }

  /**
   * Passo 2: execução.
   */
  private async step2(interaction: ButtonInteraction): Promise<void> {
    if (interaction.customId === this.buttonNoId) {
      await interaction.reply({
        content: 'Phew! What a fright.'.translate(),
        ephemeral: true
      });
    } else if (interaction.customId === this.buttonYesId) {
      await interaction.reply({
        content: "I'll be back.".translate(),
        ephemeral: true
      });
      await new TerminateApplication(
        this.configuration.applicationParameters.id,
        this.configuration.applicationParameters.id
      ).sendAsync();
    }
  }
}
