import { Interaction } from 'discord.js';

/**
 * Representa um tratamento de interação com o Discord.
 */
export interface IInteractionHandler {
  /**
   * Executa o comando.
   * @param interaction Interação chegada do discord.
   */
  run(interaction: Interaction): Promise<void> | void;
}

/**
 * Verifica se é uma instância da interface.
 */
export function isIInteractionHandler(
  instance: unknown
): instance is IInteractionHandler {
  const object = instance as Record<string, unknown>;
  return 'run' in object;
}
