import { ApplicationInteraction } from '../../ApplicationInteraction';
import { Interaction } from 'discord.js';
import { ApplicationInteractionCommand } from '../../ApplicationInteractionCommand';

/**
 * Um comando para ping-pong.
 */
export class PingPongInteraction extends ApplicationInteraction {
  /**
   * Informações como comando (se aplicável).
   */
  public override command = new ApplicationInteractionCommand(
    'ping',
    'A ping-pong command.'
  );

  /**
   * Verifica se é uma interação que deve ser tratada.
   * @param interaction Interação chegada do discord.
   */
  public override canHandle(interaction: Interaction): boolean {
    return this.command.canHandle(interaction);
  }

  /**
   * Trata a interação.
   * @param interaction Interação chegada do discord.
   */
  public override async handle(interaction: Interaction): Promise<void> {
    if (!interaction.isCommand()) {
      return;
    }

    await interaction.reply('pong');
  }
}
