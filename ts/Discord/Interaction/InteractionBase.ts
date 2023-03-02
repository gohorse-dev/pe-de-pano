import { IInteractionBase } from './IInteractionBase';
import { Interaction } from 'discord.js';
import { InteractionBaseConfiguration } from './InteractionBaseConfiguration';

/**
 * Representa um tratamento de interação com o Discord.
 */
export abstract class InteractionBase implements IInteractionBase {
  /**
   * Construtor.
   * @param configuration Configurações usadas na construção de um comando.
   */
  public constructor(
    protected readonly configuration: InteractionBaseConfiguration
  ) {}

  /**
   * Verifica se é uma interação que deve ser tratada.
   * @param interaction Interação chegada do discord.
   */
  public abstract canHandle(interaction: Interaction): boolean;

  /**
   * Trata a interação.
   * @param interaction Interação chegada do discord.
   */
  public abstract handle(interaction: Interaction): Promise<void> | void;
}
