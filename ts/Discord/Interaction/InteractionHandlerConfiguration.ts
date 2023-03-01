import { ApplicationParameters } from '@gohorse/npm-application';

/**
 * Configurações usadas na construção de uma interação com o Discord.
 */
export type InteractionHandlerConfiguration = {
  /**
   * Parâmetros da aplicação.
   */
  applicationParameters: ApplicationParameters;
};
