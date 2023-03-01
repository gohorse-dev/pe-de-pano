import { InteractionHandler } from '../InteractionHandler';
import { CommandInteraction } from 'discord.js';

/**
 * Um comando para ping-pong.
 */
export class Ping extends InteractionHandler {
  /**
   * Nome.
   */
  public override name = 'ping';

  /**
   * Descrição.
   */
  public description = 'A ping-pong command.'.translate();

  /**
   * Executa o comando.
   * @param interaction Interação chegada do discord.
   */
  public override async run(interaction: CommandInteraction): Promise<void> {
    await interaction.reply('pong');
  }
}
