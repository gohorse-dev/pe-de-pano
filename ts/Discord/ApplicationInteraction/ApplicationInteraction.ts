import { IApplicationInteraction } from './IApplicationInteraction';
import { Interaction } from 'discord.js';
import { ApplicationInteractionConfiguration } from './ApplicationInteractionConfiguration';
import { IApplicationInteractionCommand } from './IApplicationInteractionCommand';
import { HelperCryptography } from '@sergiocabral/helper';

// TODO: Criar serviço de tradução para interações com o Discord.
// TODO: Criar interface para instâncias de comandos em execução.

/**
 * Representa uma interação de Discord tratada pela aplicação.
 */
export abstract class ApplicationInteraction
  implements IApplicationInteraction
{
  /**
   * Gerador de Id.
   * @param data Dados de entrada.
   */
  public static generateId(data: unknown): string {
    return HelperCryptography.hash(data, 'md5').substring(0, 5);
  }

  /**
   * Construtor.
   * @param configuration Configurações usadas na construção de um comando.
   */
  public constructor(
    protected readonly configuration: ApplicationInteractionConfiguration
  ) {}

  /**
   * Informações como comando (se aplicável).
   */
  public abstract get command(): IApplicationInteractionCommand | undefined;

  /**
   * Verifica se é uma interação que deve ser tratada.
   * @param interaction Interação chegada do discord.
   */
  public abstract canHandle(
    interaction: Interaction
  ): Promise<boolean> | boolean;

  /**
   * Trata a interação.
   * @param interaction Interação chegada do discord.
   */
  public abstract handle(interaction: Interaction): Promise<void> | void;
}
