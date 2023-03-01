import {
  HelperText,
  InvalidDataError,
  InvalidExecutionError,
  Logger,
  LogLevel,
  Message
} from '@sergiocabral/helper';
import { RegisterCommandOnDiscord } from '../Message/RegisterCommandOnDiscord';
import { DiscordAuthenticationConfiguration } from '../DiscordAuthenticationConfiguration';
import { ApplicationReady } from '../../App/Message/ApplicationReady';
import { ConfigurationReloaded } from '@gohorse/npm-core';
import { ApplicationConfiguration } from '@gohorse/npm-application';
import { REST, Routes } from 'discord.js';
import { ApplicationCommandsResult } from '../Model/ApplicationCommandsResult';
import { GetAllInteractions } from '../Message/GetAllInteractions';
import {
  ICommandInteractionHandler,
  isICommandInteractionHandler
} from '../Interaction/ICommandInteractionHandler';

/**
 * Responsável pela gerência de todos os comandos desse bot.
 */
export class CommandInteractionManager {
  /**
   * Contexto do log.
   */
  private static logContext = 'CommandInteractionManager';

  /**
   * Construtor.
   * @param getConfiguration Configurações.
   */
  public constructor(
    private readonly getConfiguration: () => DiscordAuthenticationConfiguration
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
  }

  private configuration: DiscordAuthenticationConfiguration;

  /**
   * Lista de comandos.
   */
  private allCommands: ICommandInteractionHandler[] = [];

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
    const allInteractions = (await new GetAllInteractions().sendAsync()).message
      .allInteractions;

    if (allInteractions === undefined) {
      throw new InvalidExecutionError(
        'The list of interactions returned empty.'
      );
    }

    this.allCommands = allInteractions.filter(interaction =>
      isICommandInteractionHandler(interaction)
    ) as ICommandInteractionHandler[];

    const commands = this.allCommands.map(command => ({
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
   * Cria uma instância REST para comunicação com o Discord.
   */
  private createRest(): REST {
    return new REST({ version: '10' }).setToken(
      this.configuration.applicationToken
    );
  }
}
