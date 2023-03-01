import {
  HelperText,
  InvalidDataError,
  Logger,
  LogLevel,
  Message
} from '@sergiocabral/helper';
import { RegisterCommandOnDiscord } from '../Message/RegisterCommandOnDiscord';
import { DiscordAuthenticationConfiguration } from '../DiscordAuthenticationConfiguration';
import { ApplicationReady } from '../../App/Message/ApplicationReady';
import { ConfigurationReloaded } from '@gohorse/npm-core';
import {
  ApplicationConfiguration,
  ApplicationParameters
} from '@gohorse/npm-application';
import { REST, Routes } from 'discord.js';
import { IInteractionHandler } from '../Interaction/IInteractionHandler';
import { Ping } from '../Interaction/Implementation/Ping';
import { Hello } from '../Interaction/Implementation/Hello';
import { ApplicationCommandsResult } from '../Model/ApplicationCommandsResult';
import { DiscordInteractionReceived } from '../Message/DiscordInteractionReceived';
import { DominosPizzaPrice } from '../Interaction/Implementation/DominosPizzaPrice';
import { InteractionHandlerConfiguration } from '../Interaction/InteractionHandlerConfiguration';
import { Shutdown } from '../Interaction/Implementation/Shutdown';

/**
 * Responsável pela gerência de todos os comandos desse bot.
 */
export class CommandInteractionManager {
  /**
   * Contexto do log.
   */
  private static logContext = 'CommandInteractionManager';

  /**
   * Lista de todos os construtores possíveis desse bot.
   */
  public static allCommandsConstructors: Array<
    new (configuration: InteractionHandlerConfiguration) => IInteractionHandler
  > = [Ping, Hello, Shutdown, DominosPizzaPrice];

  /**
   * Construtor.
   * @param getConfiguration Configurações.
   * @param applicationParameters Parâmetros da aplição.
   */
  public constructor(
    private readonly getConfiguration: () => DiscordAuthenticationConfiguration,
    private readonly applicationParameters: ApplicationParameters
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

  private configuration: DiscordAuthenticationConfiguration;

  /**
   * Lista de comandos.
   */
  private commands: IInteractionHandler[] = [];

  /**
   * Comunicador com a API do Message via REST.
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
    this.commands = CommandInteractionManager.allCommandsConstructors.map(
      commandConstructor =>
        new commandConstructor({
          applicationParameters: this.applicationParameters
        })
    );

    const commands = this.commands.map(command => ({
      name: command.name,
      description: command.description
    }));

    Logger.post(
      'Registering Message commands. Total: {count}. Names: {commandNameList}',
      () => ({
        count: commands.length,
        commandNameList: commands.map(command => command.name).join(', ')
      }),
      LogLevel.Verbose,
      CommandInteractionManager.logContext
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
        'Message commands registered. Total: {count}. Names: {commandNameList}',
        () => ({
          count: response.length,
          commandNameList: response.map(command => command.name).join(', ')
        }),
        LogLevel.Debug,
        CommandInteractionManager.logContext
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
        CommandInteractionManager.logContext
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
              CommandInteractionManager.logContext
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
              CommandInteractionManager.logContext
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
