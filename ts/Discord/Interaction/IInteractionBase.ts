import { Interaction } from 'discord.js';

/**
 * Representa um tratamento de interação com o Discord.
 */
export interface IInteractionBase {
  /**
   * Verifica se é uma interação que deve ser tratada.
   * @param interaction Interação chegada do discord.
   */
  canHandle(interaction: Interaction): boolean;

  /**
   * Trata a interação.
   * @param interaction Interação chegada do discord.
   */
  handle(interaction: Interaction): Promise<void> | void;
}
