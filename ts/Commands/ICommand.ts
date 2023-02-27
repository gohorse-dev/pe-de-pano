import { CommandInteraction } from 'discord.js';

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

  /**
   * Executa o comando.
   * @param interaction Interação chegada do discord.
   */
  run(interaction: CommandInteraction): Promise<void> | void;
}
