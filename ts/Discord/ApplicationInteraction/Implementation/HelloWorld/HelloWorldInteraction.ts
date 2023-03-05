import { ApplicationInteraction } from '../../ApplicationInteraction';
import { Interaction } from 'discord.js';
import { ApplicationInteractionCommand } from '../../ApplicationInteractionCommand';

/**
 * Um comando para Hello World
 */
export class HelloWorldInteraction extends ApplicationInteraction {
  /**
   * Informações como comando (se aplicável).
   */
  public override command = new ApplicationInteractionCommand(
    'hello',
    'A hello-world command.'
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

    await discordInteraction.reply('world');
  }
}
