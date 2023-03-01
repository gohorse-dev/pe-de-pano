import { IInteractionHandler } from './IInteractionHandler';

/**
 * Representa um tratamento de interação de comando com o Discord.
 */
export interface ICommandInteractionHandler extends IInteractionHandler {
  /**
   * Nome.
   */
  get name(): string;

  /**
   * Descrição.
   */
  get description(): string;
}

/**
 * Verifica se é uma instância da interface.
 */
export function isICommandInteractionHandler(
  instance: unknown
): instance is ICommandInteractionHandler {
  const object = instance as Record<string, unknown>;
  return 'name' in object && 'description' in object;
}
