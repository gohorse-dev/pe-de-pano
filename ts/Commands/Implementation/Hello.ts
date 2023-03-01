import { Command } from '../Command';
import { CommandInteraction } from 'discord.js';

/**
 * Um comando para ping-pong que responde com hello-world
 */
export class Hello extends Command {
  /**
   * Nome.
   */
  public override name = 'hello';

  /**
   * Descrição.
   */
  public description = 'A Hello World command.'.translate();

  /**
   * Executa o comando.
   * @param interaction Interação chegada do discord.
   */
  public override async run(interaction: CommandInteraction): Promise<void> {
    await interaction.reply('world');
  }
}
