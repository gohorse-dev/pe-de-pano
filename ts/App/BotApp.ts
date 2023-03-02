import { BotAppConfiguration } from './BotAppConfiguration';
import { Logger, LogLevel, Translate } from '@sergiocabral/helper';
import { GlobalDefinition } from '@gohorse/npm-core';
import { Application } from '@gohorse/npm-application';
import { ApplicationReady } from './Message/ApplicationReady';
import { ConnectionManager } from '../Discord/IntegrationManager/ConnectionManager';
import { DominosPizzaService } from '../Service/DominosPizza/DominosPizzaService';
import { CommandInteractionManager } from '../Discord/IntegrationManager/CommandInteractionManager';
import { InteractionManager } from '../Discord/IntegrationManager/InteractionManager';

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
      'Message started.',
      undefined,
      LogLevel.Information,
      BotApp.logContext
    );

    Translate.default.selectedLanguage = 'pt-BR';

    void new DominosPizzaService();
    void new CommandInteractionManager(() => this.configuration.discord);
    void new ConnectionManager(() => this.configuration.discord);
    void new InteractionManager(this.parameters);

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
}
