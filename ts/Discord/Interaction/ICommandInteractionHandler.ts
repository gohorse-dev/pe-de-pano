import { IInteractionHandler } from './IInteractionHandler';

/**
 * Representa um tratamento de interação de comando com o Discord.
 */
export interface ICommandInteractionHandler extends IInteractionHandler {
  /**
   * Nome.
   */
  get commandName(): string;

  /**
   * Descrição.
   */
  get commandDescription(): string;
}

/**
 * Verifica se é uma instância da interface.
 */
export function isICommandInteractionHandler(
  instance: unknown
): instance is ICommandInteractionHandler {
  const object = instance as Record<string, unknown>;
  return 'commandName' in object && 'commandDescription' in object;
}
