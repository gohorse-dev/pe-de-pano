import {
  HelperText,
  InvalidDataError,
  Logger,
  LogLevel,
  Message
} from '@sergiocabral/helper';
import { RegisterCommandOnDiscord } from '../Message/Discord/RegisterCommandOnDiscord';
import { IntegrationConfiguration } from './IntegrationConfiguration';
import { ApplicationReady } from '../Message/Application/ApplicationReady';
import { ConfigurationReloaded } from '@gohorse/npm-core';
import { ApplicationConfiguration } from '@gohorse/npm-application';
import { REST, Routes } from 'discord.js';
import { ICommand } from '../Commands/ICommand';
import { Ping } from '../Commands/Implementation/Ping';
import { Hello } from '../Commands/Implementation/Hello';
import { ApplicationCommandsResult } from '../Model/Discord/ApplicationCommandsResult';
import { DiscordInteractionReceived } from '../Message/Discord/DiscordInteractionReceived';
import { DominosPizzaPrice } from '../Commands/Implementation/DominosPizzaPrice';

/**
 * Responsável pela gerência de todos os comandos desse bot.
 */
export class CommandManager {
  /**
   * Contexto do log.
   */
  private static logContext = 'CommandManager';

  /**
   * Lista de todos os construtores possíveis desse bot.
   */
  public static allCommandsConstructors: Array<new () => ICommand> = [
    Ping,
    Hello,
    DominosPizzaPrice
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
    Message.subscribe(
      RegisterCommandOnDiscord,
      this.handleRegisterCommands.bind(this)
    );
    Message.subscribe(
      DiscordInteractionReceived,
      this.handleDiscordInteractionReceived.bind(this)
    );
  }

  private configuration: IntegrationConfiguration;

  /**
   * Lista de comandos.
   */
  private commands: ICommand[] = [];

  /**
   * Comunicador com a API do Discord via REST.
   */
  private rest: REST;

  /**
   * Mensagem: ApplicationReady
   */
  private async handleApplicationReady(): Promise<void> {
    await new RegisterCommandOnDiscord().sendAsync();
  }

  /**
   * Mensagem: RegisterCommands
   */
  private async handleRegisterCommands(): Promise<void> {
    this.commands = CommandManager.allCommandsConstructors.map(
      commandConstructor => new commandConstructor()
    );

    const commands = this.commands.map(command => ({
      name: command.name,
      description: command.description
    }));

    Logger.post(
      'Registering Discord commands. Total: {count}. Names: {commandNameList}',
      () => ({
        count: commands.length,
        commandNameList: commands.map(command => command.name).join(', ')
      }),
      LogLevel.Verbose,
      CommandManager.logContext
    );

    try {
      const response = (await this.rest.put(
        Routes.applicationCommands(this.configuration.applicationId),
        { body: commands }
      )) as ApplicationCommandsResult[];

      if (!Array.isArray(response)) {
        throw new InvalidDataError('An array is expected as a result.');
      }

      Logger.post(
        'Discord commands registered. Total: {count}. Names: {commandNameList}',
        () => ({
          count: response.length,
          commandNameList: response.map(command => command.name).join(', ')
        }),
        LogLevel.Debug,
        CommandManager.logContext
      );
    } catch (error) {
      Logger.post(
        'An error occurred while registering the commands ({commandNameList}): {errorDescription}',
        {
          commandNameList: commands.map(command => command.name),
          errorDescription: HelperText.formatError(error),
          error
        },
        LogLevel.Error,
        CommandManager.logContext
      );
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
      await new RegisterCommandOnDiscord().sendAsync();
      this.rest = this.createRest();
    }
  }

  /**
   * Mensagem: DiscordInteractionReceived
   */
  private async handleDiscordInteractionReceived(
    message: DiscordInteractionReceived
  ): Promise<void> {
    const interaction = message.interaction;

    if (interaction.isCommand()) {
      for (const command of this.commands) {
        if (command.name === interaction.commandName) {
          try {
            Logger.post(
              'Running the "{commandName}" command.',
              {
                commandName: command.name
              },
              LogLevel.Debug,
              CommandManager.logContext
            );

            await command.run(interaction);
          } catch (error) {
            Logger.post(
              'Error executing command "{commandName}": {errorDescription}',
              {
                commandName: command.name,
                errorDescription: HelperText.formatError(error),
                error
              },
              LogLevel.Error,
              CommandManager.logContext
            );
          }
        }
      }
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
