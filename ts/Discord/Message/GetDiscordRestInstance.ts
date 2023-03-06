import { Message } from '@sergiocabral/helper';
import { REST } from 'discord.js';

/**
 * Obtem a instância para requisição REST com o Discord.
 */
export class GetDiscordRestInstance extends Message {
  /**
   * Instância para requisição REST com o Discord.
   */
  public rest?: REST;
}
