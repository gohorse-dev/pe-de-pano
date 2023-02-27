import { ApplicationConfiguration } from '@gohorse/npm-application';
import { IntegrationConfiguration } from '../Integration/IntegrationConfiguration';

/**
 * Configurações da aplicação.
 */
export class BotAppConfiguration extends ApplicationConfiguration {
  /**
   * Uma propriedade qualquer.
   */
  public discord = new IntegrationConfiguration().setName('discord');
}
