import { Interaction } from 'discord.js';

/**
 * Representa um tratamento de interação com o Discord.
 */
export interface IInteractionHandler {
  /**
   * Verifica se é uma interação possível de ser executada.
   * @param interaction Interação chegada do discord.
   */
  canRun(interaction: Interaction): boolean;

  /**
   * Executa o comando.
   * @param interaction Interação chegada do discord.
   */
  run(interaction: Interaction): Promise<void> | void;
}
