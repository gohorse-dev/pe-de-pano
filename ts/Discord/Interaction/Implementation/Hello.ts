import { InteractionHandler } from '../InteractionHandler';
import { Interaction } from 'discord.js';
import { ICommandInteractionHandler } from '../ICommandInteractionHandler';

/**
 * Um comando para ping-pong que responde com hello-world
 */
export class Hello
  extends InteractionHandler
  implements ICommandInteractionHandler
{
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
  public override async run(interaction: Interaction): Promise<void> {
    if (!interaction.isCommand()) {
      return;
    }

    await interaction.reply('world');
  }
}
