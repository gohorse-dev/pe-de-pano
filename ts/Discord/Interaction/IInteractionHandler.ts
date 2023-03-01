import { CommandInteraction } from 'discord.js';

/**
 * Representa um tratamento de interação com o Discord.
 */
export interface IInteractionHandler {
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
