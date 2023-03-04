import { ApplicationInteraction } from '../../ApplicationInteraction';
import { Interaction } from 'discord.js';
import { GetDominosPizzaPrice } from '../../../../Service/DominosPizza/Message/GetDominosPizzaPrice';
import { ApplicationInteractionCommand } from '../../ApplicationInteractionCommand';
import { InvalidExecutionError } from '@sergiocabral/helper';

export class DominosPizzaPriceInteraction extends ApplicationInteraction {
  /**
   * Informações como comando (se aplicável).
   */
  public override command = new ApplicationInteractionCommand(
    'pixza',
    'The PIXza exchange rate now.'
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
    if (!interaction.isRepliable()) {
      throw new InvalidExecutionError(
        'Expected a repliable Discord interaction.'
      );
    }

    const price = (await new GetDominosPizzaPrice().sendAsync()).message.price;
    await interaction.reply(
      `Hoje a cotação da PiXza está em ${price ?? 'sei lá quanto'}.`
    );
  }
}
