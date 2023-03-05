import { Interaction } from 'discord.js';
import { IApplicationInteractionCommand } from './IApplicationInteractionCommand';

/**
 * Representa uma interação de Discord tratada pela aplicação.
 */
export interface IApplicationInteraction {
  /**
   * Informações como comando (se aplicável).
   */
  get command(): IApplicationInteractionCommand | undefined;

  /**
   * Verifica se é uma interação que deve ser tratada.
   * @param interaction Interação chegada do discord.
   */
  canHandle(interaction: Interaction): Promise<boolean> | boolean;

  /**
   * Trata a interação.
   * @param interaction Interação chegada do discord.
   */
  handle(interaction: Interaction): Promise<void> | void;
}
