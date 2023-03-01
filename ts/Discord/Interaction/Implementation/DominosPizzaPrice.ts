import { InteractionHandler } from '../InteractionHandler';
import { Interaction } from 'discord.js';
import { GetDominosPizzaPrice } from '../../../Service/DominosPizza/Message/GetDominosPizzaPrice';
import { ICommandInteractionHandler } from '../ICommandInteractionHandler';

export class DominosPizzaPrice
  extends InteractionHandler
  implements ICommandInteractionHandler
{
  /**
   * Nome.
   */
  public name = 'pixza';

  /**
   * Descrição.
   */
  public description = 'The PIXza exchange rate now.'.translate();

  /**
   * Verifica se é uma interação possível de ser executada.
   * @param interaction Interação chegada do discord.
   */
  public canRun(interaction: Interaction): boolean {
    return interaction.isCommand() && interaction.commandName === this.name;
  }

  /**
   * Executa o comando.
   * @param interaction Interação chegada do discord.
   */
  public override async run(interaction: Interaction): Promise<void> {
    if (!interaction.isCommand()) {
      return;
    }

    const price = (await new GetDominosPizzaPrice().sendAsync()).message.price;
    await interaction.reply(
      `Hoje a cotação da PiXza está em ${price ?? 'sei lá quanto'}.`
    );
  }
}
