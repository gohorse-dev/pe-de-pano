import { DiscordBotAppConfiguration } from './DiscordBotAppConfiguration';
import { Logger, LogLevel, Translate } from '@sergiocabral/helper';
import { GlobalDefinition } from '@gohorse/npm-core';
import { Application } from '@gohorse/npm-application';
import { CommandManager } from '../../DiscordIntegration/CommandManager';
import { ApplicationReady } from '../../Message/Application/ApplicationReady';
import { ServerManager } from '../../DiscordIntegration/ServerManager';
import { InteractionManager } from '../../DiscordIntegration/InteractionManager';
import { DominosPizza } from '../../Service/DominosPizza/DominosPizza';

/**
 * Aplicação vazia de exemplo.
 */
export class DiscordBotApp extends Application<DiscordBotAppConfiguration> {
  /**
   * Contexto do log.
   */
  private static logContext = 'BotApp';

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

    Translate.default.selectedLanguage = 'pt-BR';

    void new DominosPizza();
    void new CommandManager(() => this.configuration.discord);
    void new ServerManager(() => this.configuration.discord);
    void new InteractionManager();

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
