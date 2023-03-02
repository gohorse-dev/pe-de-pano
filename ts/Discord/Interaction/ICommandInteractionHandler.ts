import { IInteractionBase } from './IInteractionBase';

/**
 * Representa um tratamento de interação de comando com o Discord.
 */
export interface ICommandInteractionHandler extends IInteractionBase {
  /**
   * Nome.
   */
  get commandName(): string;

  /**
   * Descrição.
   */
  get commandDescription(): string;
}
