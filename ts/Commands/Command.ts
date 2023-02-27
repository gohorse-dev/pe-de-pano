import { ICommand } from './ICommand';
import { CommandInteraction } from 'discord.js';

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

  /**
   * Executa o comando.
   * @param interaction Interação chegada do discord.
   */
  public abstract run(interaction: CommandInteraction): Promise<void>;
}
