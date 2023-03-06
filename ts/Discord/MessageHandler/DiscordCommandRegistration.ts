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
import { DiscordApplicationCommandsResult } from '../Model/DiscordApplicationCommandsResult';
import { GetApplicationInteractions } from '../Message/GetApplicationInteractions';
import { ApplicationInteractionCommand } from '../ApplicationInteraction/ApplicationInteractionCommand';
import { ApplicationInteractionsLoaded } from '../Message/ApplicationInteractionsLoaded';
import { ClearAllCommandFromDiscord } from '../Message/ClearAllCommandFromDiscord';
import { GetDiscordRestInstance } from '../Message/GetDiscordRestInstance';

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
    this.subscribeToMessages();
  }

  private configuration: DiscordAuthenticationConfiguration;

  /**
   * Comunicador com a API do Message via REST.
   */
  private restValue?: REST;

  /**
   * Comunicador com a API do Message via REST
   */
  public get rest(): REST {
    if (this.restValue === undefined) {
      throw new InvalidExecutionError('Discord REST instance is not ready.');
    }
    return this.restValue;
  }

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
      ClearAllCommandFromDiscord,
      this.handleClearAllCommandFromDiscord.bind(this)
    );
    Message.subscribe(
      RegisterCommandOnDiscord,
      this.handleRegisterCommandOnDiscord.bind(this)
    );
  }

  /**
   * Mensagem: ApplicationInteractionsLoaded
   */
  private async handleApplicationInteractionsLoaded(): Promise<void> {
    this.restValue = await this.getRestInstance();
    await new ClearAllCommandFromDiscord().sendAsync();
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
      this.restValue = await this.getRestInstance();
    }
  }

  /**
   * Obtem a instância para requisição REST com o Discord
   */
  private async getRestInstance(): Promise<REST> {
    const rest = (await new GetDiscordRestInstance().sendAsync()).message.rest;
    if (rest === undefined) {
      throw new InvalidExecutionError('Discord REST instance was not defined.');
    }
    return rest;
  }

  /**
   * Mensagem: ClearAllCommandFromDiscord
   */
  private async handleClearAllCommandFromDiscord(): Promise<void> {
    Logger.post(
      'Removing the registration of all commands.',
      undefined,
      LogLevel.Verbose,
      DiscordCommandRegistration.logContext
    );

    try {
      const response = (await this.rest.put(
        Routes.applicationCommands(this.configuration.applicationId),
        { body: [] }
      )) as DiscordApplicationCommandsResult[];

      if (!Array.isArray(response) || response.length !== 0) {
        throw new InvalidDataError('An empty array was expected as a result.');
      }

      Logger.post(
        'Successfully removed the registration of all commands.',
        undefined,
        LogLevel.Debug,
        DiscordCommandRegistration.logContext
      );
    } catch (error) {
      Logger.post(
        'An error occurred while unregistering all commands: {errorDescription}',
        () => ({
          errorDescription: HelperText.formatError(error),
          error
        }),
        LogLevel.Error,
        DiscordCommandRegistration.logContext
      );
    }
  }

  /**
   * Mensagem: RegisterCommandOnDiscord
   */
  private async handleRegisterCommandOnDiscord(): Promise<void> {
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
      )) as DiscordApplicationCommandsResult[];

      if (!Array.isArray(response)) {
        throw new InvalidDataError('An array was expected as a result.');
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
}
