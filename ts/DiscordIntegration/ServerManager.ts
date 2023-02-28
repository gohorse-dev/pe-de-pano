import {
  HelperText,
  InvalidExecutionError,
  Logger,
  LogLevel,
  Message
} from '@sergiocabral/helper';
import { IntegrationConfiguration } from './IntegrationConfiguration';
import { ApplicationReady } from '../Message/Application/ApplicationReady';
import {
  ApplicationTerminated,
  ConfigurationReloaded,
  GlobalDefinition
} from '@gohorse/npm-core';
import { ApplicationConfiguration } from '@gohorse/npm-application';
import { Client, IntentsBitField } from 'discord.js';
import { DiscordClientConnected } from '../Message/Discord/DiscordClientConnected';
import { DiscordClientDisconnected } from '../Message/Discord/DiscordClientDisconnected';

/**
 * Responsável pela gerência da comunicação com o Discord.
 */
export class ServerManager {
  /**
   * Contexto do log.
   */
  private static logContext = 'ServerManager';

  /**
   * Construtor.
   * @param getConfiguration Configurações.
   */
  public constructor(
    private readonly getConfiguration: () => IntegrationConfiguration
  ) {
    this.configuration = getConfiguration();
    this.client = this.createClient();

    Message.subscribe(
      ConfigurationReloaded,
      this.handleConfigurationReloaded.bind(this)
    );
    Message.subscribe(ApplicationReady, this.handleApplicationReady.bind(this));
    Message.subscribe(
      ApplicationTerminated,
      this.handleApplicationTerminated.bind(this)
    );
  }

  private configuration: IntegrationConfiguration;

  /**
   * Cliente para o Discord.
   */
  private client: Client;

  /**
   * Verifica se o cliente está logado.
   */
  public get isLogged(): boolean {
    return this.client.isReady();
  }

  /**
   * Mensagem: ApplicationReady
   */
  private async handleApplicationReady(): Promise<void> {
    await this.login();
  }

  /**
   * Mensagem: ApplicationTerminated
   */
  private async handleApplicationTerminated(): Promise<void> {
    if (this.isLogged) {
      await this.logout();
    }
  }

  /**
   * Mensagem: ConfigurationReloaded
   */
  private async handleConfigurationReloaded(): Promise<void> {
    const configuration = ApplicationConfiguration.readConfiguration(
      this.getConfiguration
    );
    if (configuration !== undefined) {
      if (this.isLogged) {
        await this.logout();
        await this.login();
      }
    }
  }

  /**
   * Cria uma instância do client para o Discord.
   */
  private createClient(): Client {
    return new Client({ intents: [IntentsBitField.Flags.Guilds] });
  }

  /**
   * Realiza o login via o client.
   */
  private async login(): Promise<boolean> {
    let client = this.client;
    if (client.isReady()) {
      throw new InvalidExecutionError('The client is already logged in.');
    }
    client = this.client;

    try {
      Logger.post(
        'Logging on through the client.',
        undefined,
        LogLevel.Verbose,
        ServerManager.logContext
      );

      const result = await client.login(this.configuration.applicationToken);
      const success = result === this.configuration.applicationToken;

      if (success) {
        Logger.post(
          'Login successful. Waiting to be ready.',
          undefined,
          LogLevel.Verbose,
          ServerManager.logContext
        );
      } else {
        Logger.post(
          'Login seems to have been successfully performed, but the return was not as expected.  Waiting to be ready.',
          undefined,
          LogLevel.Verbose,
          ServerManager.logContext
        );
      }
    } catch (error) {
      Logger.post(
        'Error during login via client: {errorDescription}',
        {
          errorDescription: HelperText.formatError(error),
          error
        },
        LogLevel.Error,
        ServerManager.logContext
      );

      return false;
    }

    let resolved = false;
    return new Promise((resolve, reject) => {
      const onReady = () => {
        if (resolved) {
          return reject(
            new InvalidExecutionError(
              'Program execution did not occur as expected.'
            )
          );
        }
        resolved = true;

        Logger.post(
          'Login completed successfully.',
          undefined,
          LogLevel.Information,
          ServerManager.logContext
        );

        client.off('ready', onReady);
        resolve(true);

        new DiscordClientConnected(client).send();
      };
      client.on('ready', onReady);

      const tenSeconds =
        10 * GlobalDefinition.TIME_OF_ONE_SECOND_IN_MILLISECONDS;
      setTimeout(() => {
        if (resolved) {
          return reject(
            new InvalidExecutionError(
              'Program execution did not occur as expected.'
            )
          );
        }
        resolved = true;

        Logger.post(
          'Login did not result in a ready state.',
          undefined,
          LogLevel.Error,
          ServerManager.logContext
        );

        client.off('ready', onReady);
        resolve(false);
      }, tenSeconds);
    });
  }

  /**
   * Realiza o logout do client.
   */
  private async logout(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.client.isReady()) {
        return reject(
          new InvalidExecutionError('The client was not logged in.')
        );
      }

      new DiscordClientDisconnected(this.client).send();

      this.client.destroy();
      this.client = this.createClient();

      Logger.post(
        'Dropped client with discord to log off.',
        undefined,
        LogLevel.Information,
        ServerManager.logContext
      );

      resolve(true);
    });
  }
}
