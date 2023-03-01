import { Command } from '../Command';
import { CommandInteraction } from 'discord.js';
import { TerminateApplication } from '@gohorse/npm-core';

/**
 * Desliga o bot como aplição em execução no sistema operacional.
 */
export class Shutdown extends Command {
  /**
   * Nome.
   */
  public override name = 'shutdown';

  /**
   * Descrição.
   */
  public description = 'Turn off this bot.'.translate();

  /**
   * Executa o comando.
   * @param interaction Interação chegada do discord.
   */
  public override async run(interaction: CommandInteraction): Promise<void> {
    await new TerminateApplication(
      this.configuration.applicationParameters.id,
      this.configuration.applicationParameters.id
    ).sendAsync();
  }
}
