import { IApplicationInteraction } from './IApplicationInteraction';
import { Interaction } from 'discord.js';
import { ApplicationInteractionConfiguration } from './ApplicationInteractionConfiguration';

/**
 * Representa uma interação de Discord tratada pela aplicação.
 */
export abstract class ApplicationInteraction
  implements IApplicationInteraction
{
  /**
   * Construtor.
   * @param configuration Configurações usadas na construção de um comando.
   */
  public constructor(
    protected readonly configuration: ApplicationInteractionConfiguration
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
