import { BotAppConfiguration } from './BotAppConfiguration';
import { Logger, LogLevel } from '@sergiocabral/helper';
import { GlobalDefinition } from '@gohorse/npm-core';
import { Application } from '@gohorse/npm-application';
import { ApplicationReady } from './Message/ApplicationReady';
import { DiscordConnection } from '../Discord/IntegrationManager/DiscordConnection';
import { DominosPizzaService } from '../Service/DominosPizza/DominosPizzaService';
import { ApplicationInteractionDispatcher } from '../Discord/IntegrationManager/ApplicationInteractionDispatcher';
import { ApplicationInteractionLoader } from '../Discord/IntegrationManager/ApplicationInteractionLoader';
import { DiscordInteractionHandler } from '../Discord/IntegrationManager/DiscordInteractionHandler';
import { DiscordCommandRegistration } from '../Discord/IntegrationManager/DiscordCommandRegistration';

/**
 * Aplicação vazia de exemplo.
 */
export class BotApp extends Application<BotAppConfiguration> {
  /**
   * Contexto do log.
   */
  private static logContext = 'BotApp';

  /**
   * Tipo da Configurações da aplicação;
   */
  protected override configurationConstructor = BotAppConfiguration;

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
      BotApp.logContext
    );

    this.createModules();

    await new ApplicationReady().sendAsync();

    return new Promise(resolve => {
      const closeApp = (): unknown =>
        this.closeApp
          ? resolve()
          : setTimeout(
              closeApp,
              GlobalDefinition.TIME_OF_ONE_SECOND_IN_MILLISECONDS
            );
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
      BotApp.logContext
    );
  }

  /**
   * Cria os módulos do sistema.
   */
  private createModules(): void {
    void new DominosPizzaService();
    void new DiscordConnection(() => this.configuration.discord);
    void new DiscordCommandRegistration(() => this.configuration.discord);
    void new DiscordInteractionHandler();
    void new ApplicationInteractionLoader(this.parameters);
    void new ApplicationInteractionDispatcher();
  }
}
