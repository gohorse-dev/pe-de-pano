import { ICommand } from './ICommand';
import { CommandInteraction } from 'discord.js';
import { CommandConfiguration } from './CommandConfiguration';

/**
 * Representa um comando do Discord
 */
export abstract class Command implements ICommand {
  /**
   * Construtor.
   * @param configuration Configurações usadas na construção de um comando.
   */
  public constructor(protected readonly configuration: CommandConfiguration) {}

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
