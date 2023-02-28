import { Message } from '@sergiocabral/helper';
import { Interaction } from 'discord.js';

/**
 * Interação do Discord recebida.
 */
export class DiscordInteractionReceived extends Message {
  /**
   * Construtor.
   * @param interaction Interação do Discord.
   */
  constructor(public readonly interaction: Interaction) {
    super();
  }
}
