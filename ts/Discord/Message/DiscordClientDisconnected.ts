import { Message } from '@sergiocabral/helper';
import { Client } from 'discord.js';

/**
 * Sinaliza que o cliente do discord se desconectou.
 */
export class DiscordClientDisconnected extends Message {
  /**
   * Construtor.
   * @param client Cliente de comunicação com o Message.
   */
  constructor(public readonly client: Client) {
    super();
  }
}
