import { Interaction } from 'discord.js';

/**
 * Representa uma interação de Discord tratada pela aplicação.
 */
export interface IApplicationInteraction {
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
