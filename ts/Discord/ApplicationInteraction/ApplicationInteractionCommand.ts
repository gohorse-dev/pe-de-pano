import { Interaction } from 'discord.js';

/**
 * Representa um comando tratado pela aplicação
 */
export class ApplicationInteractionCommand {
  /**
   * Construtor.
   * @param name Nome
   * @param description Descrição.
   */
  public constructor(
    public readonly name: string,
    public readonly description: string
  ) {}

  /**
   * Verifica se é uma interação que deve ser tratada.
   * @param interaction Interação chegada do discord.
   */
  public canHandle(interaction: Interaction): boolean {
    return interaction.isCommand() && interaction.commandName === this.name;
  }
}
