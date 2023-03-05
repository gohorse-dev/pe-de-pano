import { ApplicationInteraction } from '../../ApplicationInteraction';
import { Interaction } from 'discord.js';
import { GetDominosPizzaPrice } from '../../../../Service/DominosPizza/Message/GetDominosPizzaPrice';
import { ApplicationInteractionCommand } from '../../ApplicationInteractionCommand';
import { InvalidExecutionError } from '@sergiocabral/helper';

/**
 * Consulta o valor da pixxa da Domino's.
 */
export class DominosPizzaPriceInteraction extends ApplicationInteraction {
  /**
   * Informações como comando (se aplicável).
   */
  public override command = new ApplicationInteractionCommand(
    'pixza',
    'The PIXza exchange rate now.'
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
    if (!discordInteraction.isRepliable()) {
      throw new InvalidExecutionError(
        'Expected a repliable Discord interaction.'
      );
    }

    const price = (await new GetDominosPizzaPrice().sendAsync()).message.price;
    await discordInteraction.reply(
      `Hoje a cotação da PiXza está em ${price ?? 'sei lá quanto'}.`
    );
  }
}
