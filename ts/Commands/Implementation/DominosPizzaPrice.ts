import { Command } from '../Command';
import { CommandInteraction } from 'discord.js';
import { GetDominosPizzaPrice } from '../../Message/DominosPizza/GetDominosPizzaPrice';

export class DominosPizzaPrice extends Command {
  /**
   * Nome.
   */
  public override name = 'pixza';

  /**
   * Descrição.
   */
  public description = 'The PIXza exchange rate now.'.translate();

  /**
   * Executa o comando.
   * @param interaction Interação chegada do discord.
   */
  public override async run(interaction: CommandInteraction): Promise<void> {
    const price = (await new GetDominosPizzaPrice().sendAsync()).message.price;
    await interaction.reply(
      `Hoje a cotação da PiXza está em ${price ?? 'sei lá quanto'}.`
    );
  }
}
