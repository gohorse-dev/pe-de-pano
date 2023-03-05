import { ApplicationInteraction } from '../../ApplicationInteraction';
import { Interaction } from 'discord.js';
import { ApplicationInteractionCommand } from '../../ApplicationInteractionCommand';

/**
 * Um comando para Ping Pong.
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
   * Verifica se é uma interação do Discord que deve ser tratada.
   * @param discordInteraction Interação do Discord.
   */
  public override canHandle(discordInteraction: Interaction): boolean {
    return this.command.canHandle(discordInteraction);
  }

  /**
   * Trata a interação do Discord.
   * @param discordInteraction Interação do Discord.
   */
  public override async handle(discordInteraction: Interaction): Promise<void> {
    if (!discordInteraction.isCommand()) {
      return;
    }

    await discordInteraction.reply('pong');
  }
}
