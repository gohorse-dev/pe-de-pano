import { Logger, LogLevel, Message } from '@sergiocabral/helper';
import { RegisterCommands } from '../Message/RegisterCommands';
import { IntegrationConfiguration } from './IntegrationConfiguration';
import { ApplicationReady } from '../Message/ApplicationReady';
import { ConfigurationReloaded } from '@gohorse/npm-core';
import { ApplicationConfiguration } from '@gohorse/npm-application';
import { REST, Routes } from 'discord.js';
import { ICommand } from '../Commands/ICommand';
import { Ping } from '../Commands/Implementation/Ping';
import { Hello } from '../Commands/Implementation/Hello';

/**
 * Responsável pela gerência de todos os comandos desse bot.
 */
export class Commands {
  /**
   * Contexto do log.
   */
  private static logContext = 'Commands';

  /**
   * Lista de todos os construtores possíveis desse bot.
   */
  public static allCommandsConstructors: Array<new () => ICommand> = [
    Ping,
    Hello
  ];

  /**
   * Construtor.
   * @param getConfiguration Configurações.
   */
  public constructor(
    private readonly getConfiguration: () => IntegrationConfiguration
  ) {
    this.configuration = getConfiguration();
    this.rest = this.createRest();

    Message.subscribe(
      ConfigurationReloaded,
      this.handleConfigurationReloaded.bind(this)
    );
    Message.subscribe(ApplicationReady, this.handleApplicationReady.bind(this));
    Message.subscribe(RegisterCommands, this.handleRegisterCommands.bind(this));
  }

  private configuration: IntegrationConfiguration;

  /**
   * Lista de comandos.
   */
  private allCommands: ICommand[] = [];

  /**
   * Comunicador com a API do Discord via REST.
   */
  private rest: REST;

  /**
   * Mensagem: ApplicationReady
   */
  private async handleApplicationReady(): Promise<void> {
    await new RegisterCommands().sendAsync();
  }

  /**
   * Mensagem: RegisterCommands
   */
  private async handleRegisterCommands(): Promise<void> {
    Logger.post(
      'Registering Discord commands. Total: {count}.',
      () => ({
        count: Commands.allCommandsConstructors.length
      }),
      LogLevel.Verbose,
      Commands.logContext
    );

    this.allCommands = Commands.allCommandsConstructors.map(
      commandConstructor => new commandConstructor()
    );

    const commands = this.allCommands.map(command => ({
      name: command.name,
      description: command.description
    }));

    const response = await this.rest.put(
      Routes.applicationCommands(this.configuration.applicationId),
      { body: commands }
    );

    // TODO: Usar `response` no log posterior.

    Logger.post(
      'Discord commands registered. Total: {count}. Names: {commandNameList}',
      () => ({
        count: commands.length,
        commandNameList: commands.map(command => command.name)
      }),
      LogLevel.Debug,
      Commands.logContext
    );
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
      this.rest = this.createRest();
    }
  }

  /**
   * Cria uma instância REST para comunicação com o Discord.
   */
  private createRest(): REST {
    return new REST({ version: '10' }).setToken(
      this.configuration.applicationToken
    );
  }
}
