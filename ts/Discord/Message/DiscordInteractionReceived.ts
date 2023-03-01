import { Message } from '@sergiocabral/helper';
import { Interaction } from 'discord.js';

/**
 * Interação do Message recebida.
 */
export class DiscordInteractionReceived extends Message {
  /**
   * Construtor.
   * @param interaction Interação do Message.
   */
  constructor(public readonly interaction: Interaction) {
    super();
  }
}