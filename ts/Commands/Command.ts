import { ICommand } from './ICommand';

/**
 * Representa um comando do Discord
 */
export abstract class Command implements ICommand {
  /**
   * Nome.
   */
  public abstract get name(): string;

  /**
   * Descrição.
   */
  public abstract get description(): string;
}
