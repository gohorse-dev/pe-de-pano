import { IInteractionHandler } from './IInteractionHandler';
import { Interaction } from 'discord.js';
import { InteractionHandlerConfiguration } from './InteractionHandlerConfiguration';

/**
 * Representa um tratamento de interação com o Discord.
 */
export abstract class InteractionHandler implements IInteractionHandler {
  /**
   * Construtor.
   * @param configuration Configurações usadas na construção de um comando.
   */
  public constructor(
    protected readonly configuration: InteractionHandlerConfiguration
  ) {}

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
  public abstract run(interaction: Interaction): Promise<void>;
}
