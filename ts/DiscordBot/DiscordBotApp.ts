import { DiscordBotAppConfiguration } from './DiscordBotAppConfiguration';
import { Logger, LogLevel } from '@sergiocabral/helper';
import { GlobalDefinition } from '@gohorse/npm-core';
import { Application } from '@gohorse/npm-application';
import { DiscordCommands } from '../DiscordIntegration/DiscordCommands';
import { ApplicationReady } from './Message/ApplicationReady';

/**
 * Aplicação vazia de exemplo.
 */
export class DiscordBotApp extends Application<DiscordBotAppConfiguration> {
  /**
   * Contexto do log.
   */
  private static logContext = 'DiscordBotApp';

  /**
   * Tipo da Configurações da aplicação;
   */
  protected override configurationConstructor = DiscordBotAppConfiguration;

  /**
   * Sinaliza que a aplicação deve finalizar.
   */
  private closeApp = false;

  /**
   * Inicia a aplicação.
   */
  protected override async onStart(): Promise<void> {
    Logger.post(
      'Application started.',
      undefined,
      LogLevel.Information,
      DiscordBotApp.logContext
    );

    void new DiscordCommands(() => this.configuration.discord);

    await new ApplicationReady().sendAsync();

    return new Promise(resolve => {
      const closeApp = () => {
        if (this.closeApp) {
          resolve();
        } else {
          setTimeout(
            closeApp,
            GlobalDefinition.TIME_OF_ONE_SECOND_IN_MILLISECONDS
          );
        }
      };
      closeApp();
    });
  }

  /**
   * Finaliza a aplicação.
   */
  protected override onStop(): void {
    this.closeApp = true;
    Logger.post(
      'Closing application.',
      undefined,
      LogLevel.Information,
      DiscordBotApp.logContext
    );
  }
}
