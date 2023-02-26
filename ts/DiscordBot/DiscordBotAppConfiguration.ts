import { ApplicationConfiguration } from '@gohorse/npm-application';
import { DiscordIntegrationConfiguration } from '../DiscordIntegration/DiscordIntegrationConfiguration';

/**
 * Configurações da aplicação.
 */
export class DiscordBotAppConfiguration extends ApplicationConfiguration {
  /**
   * Uma propriedade qualquer.
   */
  public discord = new DiscordIntegrationConfiguration().setName('discord');
}
