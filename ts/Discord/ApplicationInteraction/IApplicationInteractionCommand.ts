import { Interaction } from 'discord.js';

/**
 * Representa um comando tratado pela aplicação
 */
export interface IApplicationInteractionCommand {
  /**
   * Nome.
   */
  get name(): string;

  /**
   * Descrição.
   */
  get description(): string;

  /**
   * Verifica se é uma interação que deve ser tratada.
   * @param interaction Interação chegada do discord.
   */
  canHandle(interaction: Interaction): boolean;
}
