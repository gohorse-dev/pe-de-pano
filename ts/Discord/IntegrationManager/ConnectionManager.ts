import {
  HelperText,
  InvalidExecutionError,
  Logger,
  LogLevel,
  Message
} from '@sergiocabral/helper';
import { DiscordAuthenticationConfiguration } from '../DiscordAuthenticationConfiguration';
import { ApplicationReady } from '../../App/Message/ApplicationReady';
import {
  ApplicationTerminated,
  ConfigurationReloaded,
  GlobalDefinition
} from '@gohorse/npm-core';
import { ApplicationConfiguration } from '@gohorse/npm-application';
import { Client, IntentsBitField } from 'discord.js';
import { DiscordClientConnected } from '../Message/DiscordClientConnected';
import { DiscordClientDisconnected } from '../Message/DiscordClientDisconnected';

/**
 * Responsável pela gerência da comunicação com o Discord.
 */
export class ConnectionManager {
  /**
   * Contexto do log.
   */
  private static logContext = 'ConnectionManager';

  /**
   * Construtor.
   * @param getConfiguration Configurações.
   */
  public constructor(
    private readonly getConfiguration: () => DiscordAuthenticationConfiguration
  ) {
    this.configuration = getConfiguration();
    this.client = this.createClient();
    this.subscribeToMessages();
  }

  private configuration: DiscordAuthenticationConfiguration;

  /**
   * Cliente para o Message.
   */
  private client: Client;

  /**
   * Verifica se o cliente está logado.
   */
  public get isLogged(): boolean {
    return this.client.isReady();
  }

  /**
   * Se inscreve nas mensagens de interesse.
   */
  private subscribeToMessages(): void {
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
      this.configuration = configuration;
      if (this.isLogged) {
        await this.logout();
        await this.login();
      }
    }
  }

  /**
   * Cria uma instância do client para o Message.
   */
  private createClient(): Client {
    return new Client({ intents: [IntentsBitField.Flags.Guilds] });
  }

  /**
   * Realiza o login via o client.
   */
  private async login(): Promise<boolean> {
    if (this.isLogged) {
      return false;
    }

    try {
      Logger.post(
        'Logging on through the client.',
        undefined,
        LogLevel.Verbose,
        ConnectionManager.logContext
      );

      const result = await this.client.login(
        this.configuration.applicationToken
      );
      const success = result === this.configuration.applicationToken;

      if (success) {
        Logger.post(
          'Login successful. Waiting to be ready.',
          undefined,
          LogLevel.Verbose,
          ConnectionManager.logContext
        );
      } else {
        Logger.post(
          'Login seems to have been successfully performed, but the return was not as expected. Waiting to be ready.',
          undefined,
          LogLevel.Verbose,
          ConnectionManager.logContext
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
        ConnectionManager.logContext
      );

      return false;
    }

    let resolved = false;
    return new Promise((resolve, reject) => {
      const onReady = () => {
        if (resolved) {
          return reject(
            new InvalidExecutionError(
              'Program execution did not occur as expected because the Promise already resolved and onReady cannot be called.'
            )
          );
        }
        resolved = true;

        Logger.post(
          'Login completed successfully.',
          undefined,
          LogLevel.Information,
          ConnectionManager.logContext
        );

        this.client.off('ready', onReady);
        resolve(true);

        new DiscordClientConnected(this.client).send();
      };
      this.client.on('ready', onReady);

      const tenSeconds =
        10 * GlobalDefinition.TIME_OF_ONE_SECOND_IN_MILLISECONDS;
      setTimeout(() => {
        if (resolved) {
          return reject(
            new InvalidExecutionError(
              'Program execution did not occur as expected because the Promise already resolved and timeout cannot be called.'
            )
          );
        }
        resolved = true;

        Logger.post(
          'Login did not result in a ready state.',
          undefined,
          LogLevel.Error,
          ConnectionManager.logContext
        );

        this.client.off('ready', onReady);
        resolve(false);
      }, tenSeconds);
    });
  }

  /**
   * Realiza o logout do client.
   */
  private async logout(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.isLogged) {
        return reject(false);
      }

      new DiscordClientDisconnected(this.client).send();

      this.client.destroy();
      this.client = this.createClient();

      Logger.post(
        'Dropped client with discord to log off.',
        undefined,
        LogLevel.Information,
        ConnectionManager.logContext
      );

      resolve(true);
    });
  }
}
