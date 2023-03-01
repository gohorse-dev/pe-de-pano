import { ApplicationConfiguration } from '@gohorse/npm-application';
import { DiscordAuthenticationConfiguration } from '../Discord/DiscordAuthenticationConfiguration';

/**
 * Configurações da aplicação.
 */
export class BotAppConfiguration extends ApplicationConfiguration {
  /**
   * Uma propriedade qualquer.
   */
  public discord = new DiscordAuthenticationConfiguration().setName('discord');
}
