import { ApplicationConfiguration } from '@gohorse/npm-application';
import { IntegrationConfiguration } from '../../DiscordIntegration/IntegrationConfiguration';

/**
 * Configurações da aplicação.
 */
export class DiscordBotAppConfiguration extends ApplicationConfiguration {
  /**
   * Uma propriedade qualquer.
   */
  public discord = new IntegrationConfiguration().setName('discord');
}
