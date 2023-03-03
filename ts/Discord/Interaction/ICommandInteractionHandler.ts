import { IApplicationInteraction } from './IApplicationInteraction';

/**
 * Representa um tratamento de interação de comando com o Discord.
 */
export interface ICommandInteractionHandler extends IApplicationInteraction {
  /**
   * Nome.
   */
  get commandName(): string;

  /**
   * Descrição.
   */
  get commandDescription(): string;
}
