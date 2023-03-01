import { Message } from '@sergiocabral/helper';
import { Client } from 'discord.js';

/**
 * Sinaliza que o cliente do discord se conectou.
 */
export class DiscordClientConnected extends Message {
  /**
   * Construtor.
   * @param client Cliente de comunicação com o Message.
   */
  constructor(public readonly client: Client) {
    super();
  }
}
