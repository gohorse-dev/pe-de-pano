/**
 * Representa um comando do Discord.
 */
export interface ICommand {
  /**
   * Nome.
   */
  get name(): string;

  /**
   * Descrição.
   */
  get description(): string;
}
