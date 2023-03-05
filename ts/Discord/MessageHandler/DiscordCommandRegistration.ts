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
import { ConfigurationReloaded } from '@gohorse/npm-core';
import { ApplicationConfiguration } from '@gohorse/npm-application';
import { REST, Routes } from 'discord.js';
import { ApplicationCommandsResult } from '../Model/ApplicationCommandsResult';
import { GetApplicationInteractions } from '../Message/GetApplicationInteractions';
import { ApplicationInteractionCommand } from '../ApplicationInteraction/ApplicationInteractionCommand';
import { ApplicationInteractionsLoaded } from '../Message/ApplicationInteractionsLoaded';

/**
 * Responsável pelo registro de comandos no Discord.
 */
export class DiscordCommandRegistration {
  /**
   * Contexto do log.
   */
  private static logContext = 'DiscordCommandRegistration';

  /**
   * Construtor.
   * @param getConfiguration Configurações.
   */
  public constructor(
    private readonly getConfiguration: () => DiscordAuthenticationConfiguration
  ) {
    this.configuration = getConfiguration();
    this.rest = this.createRest();
    this.subscribeToMessages();
  }

  private configuration: DiscordAuthenticationConfiguration;

  /**
   * Comunicador com a API do Message via REST.
   */
  private rest: REST;

  /**
   * Inscrição nas mensagens.
   */
  private subscribeToMessages(): void {
    Message.subscribe(
      ApplicationInteractionsLoaded,
      this.handleApplicationInteractionsLoaded.bind(this)
    );
    Message.subscribe(
      ConfigurationReloaded,
      this.handleConfigurationReloaded.bind(this)
    );
    Message.subscribe(
      RegisterCommandOnDiscord,
      this.handleRegisterCommands.bind(this)
    );
  }

  /**
   * Mensagem: ApplicationInteractionsLoaded
   */
  private async handleApplicationInteractionsLoaded(): Promise<void> {
    await new RegisterCommandOnDiscord().sendAsync();
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
      await new RegisterCommandOnDiscord().sendAsync();
      this.rest = this.createRest();
    }
  }

  /**
   * Mensagem: RegisterCommands
   */
  private async handleRegisterCommands(): Promise<void> {
    const interactions = (await new GetApplicationInteractions().sendAsync())
      .message.interactions;

    if (interactions === undefined) {
      throw new InvalidExecutionError(
        'The list of interactions returned empty.'
      );
    }

    const commands = interactions
      .map(interaction => interaction.command)
      .filter(
        command => command !== undefined
      ) as ApplicationInteractionCommand[];

    Logger.post(
      'Registering Message commands. Total: {count}. Names: {commandNameList}',
      () => ({
        count: commands.length,
        commandNameList: commands.map(command => command.name).join(', '),
        commandList: commands.map(command => command.name)
      }),
      LogLevel.Verbose,
      DiscordCommandRegistration.logContext
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
          commandNameList: response.map(command => command.name).join(', '),
          commandName: response.map(command => command.name)
        }),
        LogLevel.Debug,
        DiscordCommandRegistration.logContext
      );
    } catch (error) {
      Logger.post(
        'An error occurred while registering the commands ({commandNameList}): {errorDescription}',
        () => ({
          commandNameList: commands.map(command => command.name),
          errorDescription: HelperText.formatError(error),
          error
        }),
        LogLevel.Error,
        DiscordCommandRegistration.logContext
      );
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
