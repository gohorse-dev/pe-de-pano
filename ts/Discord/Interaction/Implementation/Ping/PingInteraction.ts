import { InteractionHandler } from '../../InteractionHandler';
import { Interaction } from 'discord.js';
import { ICommandInteractionHandler } from '../../ICommandInteractionHandler';

/**
 * Um comando para ping-pong.
 */
export class PingInteraction
  extends InteractionHandler
  implements ICommandInteractionHandler
{
  /**
   * Nome.
   */
  public commandName = 'ping';

  /**
   * Descrição.
   */
  public commandDescription = 'A ping-pong command.'.translate();

  /**
   * Verifica se é uma interação possível de ser executada.
   * @param interaction Interação chegada do discord.
   */
  public canRun(interaction: Interaction): boolean {
    return (
      interaction.isCommand() && interaction.commandName === this.commandName
    );
  }

  /**
   * Executa o comando.
   * @param interaction Interação chegada do discord.
   */
  public override async run(interaction: Interaction): Promise<void> {
    if (!interaction.isCommand()) {
      return;
    }

    await interaction.reply('pong');
  }
}