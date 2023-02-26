import { Message } from '@sergiocabral/helper';
import { RegisterCommands } from './Message/RegisterCommands';
import { DiscordIntegrationConfiguration } from './DiscordIntegrationConfiguration';
import { ApplicationReady } from '../DiscordBot/Message/ApplicationReady';
import { ConfigurationReloaded } from '@gohorse/npm-core';
import { ApplicationConfiguration } from '@gohorse/npm-application';

export class DiscordCommands {
  /**
   * Construtor.
   * @param getConfiguration Configurações.
   */
  public constructor(
    private readonly getConfiguration: () => DiscordIntegrationConfiguration
  ) {
    this.configuration = getConfiguration();

    Message.subscribe(
      ConfigurationReloaded,
      this.handleConfigurationReloaded.bind(this)
    );
    Message.subscribe(ApplicationReady, this.handleApplicationReady.bind(this));
    Message.subscribe(RegisterCommands, this.handleRegisterCommands.bind(this));
  }

  private configuration: DiscordIntegrationConfiguration;

  /**
   * Mensagem: ApplicationReady
   */
  private async handleApplicationReady(): Promise<void> {
    await new RegisterCommands().sendAsync();
  }

  /**
   * Mensagem: RegisterCommands
   */
  private handleRegisterCommands(): void {
    console.log(11111111);
  }

  /**
   * Mensagem: ConfigurationReloaded
   */
  private async handleConfigurationReloaded(): Promise<void> {
    const configuration = ApplicationConfiguration.readConfiguration(
      this.getConfiguration
    );
    if (configuration !== undefined) {
      await new RegisterCommands().sendAsync();
    }
  }
}
