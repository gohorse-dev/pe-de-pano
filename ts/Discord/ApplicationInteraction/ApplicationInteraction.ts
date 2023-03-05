import { Interaction } from 'discord.js';
import { HelperCryptography } from '@sergiocabral/helper';
import { ApplicationInteractionCommand } from './ApplicationInteractionCommand';

// TODO: Criar serviço de tradução para interações com o Discord.

/**
 * Interação de Discord tratada pela aplicação.
 */
export abstract class ApplicationInteraction {
  /**
   * Gerador de Id.
   * @param data Dados de entrada.
   */
  public static generateId(data: unknown): string {
    return HelperCryptography.hash(data, 'md5').substring(0, 5);
  }

  /**
   * Informações como comando (se aplicável).
   */
  public abstract get command(): ApplicationInteractionCommand | undefined;

  /**
   * Verifica se é uma interação do Discord que deve ser tratada.
   * @param discordInteraction Interação do Discord.
   */
  public abstract canHandle(
    discordInteraction: Interaction
  ): Promise<boolean> | boolean;

  /**
   * Trata a interação do Discord.
   * @param discordInteraction Interação do discord.
   */
  public abstract handle(discordInteraction: Interaction): Promise<void> | void;
}
