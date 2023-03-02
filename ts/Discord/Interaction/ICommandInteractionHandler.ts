import { IInteractionHandler } from './IInteractionHandler';

/**
 * Representa um tratamento de interação de comando com o Discord.
 */
export interface ICommandInteractionHandler extends IInteractionHandler {
  /**
   * Nome.
   */
  get commandName(): string;

  /**
   * Descrição.
   */
  get commandDescription(): string;
}
