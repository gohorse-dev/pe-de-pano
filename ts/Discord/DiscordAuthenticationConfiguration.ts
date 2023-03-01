import { JsonLoader } from '@sergiocabral/helper';

/**
 * Configurações para integração com o Message.
 */
export class DiscordAuthenticationConfiguration extends JsonLoader {
  /**
   * Identificador da aplicação.
   */
  applicationId = '0123456789ABCDEF';

  /**
   * Token (senha) de acesso da aplicação.
   */
  applicationToken = '0123456789ABCDEF';

  /**
   * Cave pública da aplicação.
   */
  applicationPublicKey = '0123456789ABCDEF';
}
