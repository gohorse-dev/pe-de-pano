import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Interaction,
  InteractionResponse
} from 'discord.js';
import { ApplicationInteractionInstanceStep } from '../../ApplicationInteractionInstanceStep';
import { ShutdownInteractionInstanceMemory } from './ShutdownInteractionInstanceMemory';
import { ShutdownInteractionStepAnswerYes } from './ShutdownInteractionStepAnswerYes';
import { ShutdownInteractionStepAnswerNo } from './ShutdownInteractionStepAnswerNo';
import { ShouldNeverHappenError } from '@sergiocabral/helper';

/**
 * Pergunta de confirmação.
 * Desliga o bot como aplição em execução no sistema operacional.
 */
export class ShutdownInteractionStepConfirmation extends ApplicationInteractionInstanceStep<ShutdownInteractionInstanceMemory> {
  /**
   * Botão Não: Id
   */
  private buttonYesId = `${this.id}|${this.applicationInteractionInstance.memory.buttonYesId}`;

  /**
   * Botáo Sim: Instância
   */
  private buttonYes: ButtonBuilder = new ButtonBuilder()
    .setCustomId(this.buttonYesId)
    .setLabel('Yes. You deserve it.'.translate())
    .setStyle(ButtonStyle.Danger);

  /**
   * Botão Não: Id
   */
  private buttonNoId = `${this.id}|${this.applicationInteractionInstance.memory.buttonNoId}`;

  /**
   * Botão Não: Instância
   */
  private buttonNo: ButtonBuilder = new ButtonBuilder()
    .setCustomId(this.buttonNoId)
    .setLabel('No. It was just a joke.'.translate())
    .setStyle(ButtonStyle.Primary);

  /**
   * Trata a interação do Discord.
   * @param discordInteraction Interação do Discord.
   */
  protected override async doHandle(
    discordInteraction: Interaction
  ): Promise<InteractionResponse> {
    if (!discordInteraction.isCommand()) {
      throw new ShouldNeverHappenError(
        'Expected a Discord interaction as command.'
      );
    }

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      this.buttonNo,
      this.buttonYes
    );

    this.applicationInteractionInstance.addStep(
      new ShutdownInteractionStepAnswerNo(
        this.applicationInteractionInstance,
        discordInteraction
      ),
      this.buttonNoId
    );

    this.applicationInteractionInstance.addStep(
      new ShutdownInteractionStepAnswerYes(
        this.applicationInteractionInstance,
        discordInteraction
      ),
      this.buttonYesId
    );

    return await discordInteraction.reply({
      content: 'You intend to kill me, is that it?'.translate(),
      components: [row],
      ephemeral: true
    });
  }
}
