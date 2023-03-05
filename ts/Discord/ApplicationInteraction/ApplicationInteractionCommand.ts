import { Interaction } from 'discord.js';

/**
 * Comando de Discord tratada pela aplicação
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
   * Verifica se é uma interação do Discord que deve ser tratada.
   * @param discordInteraction Interação do Discord.
   */
  public canHandle(discordInteraction: Interaction): boolean {
    return (
      discordInteraction.isCommand() &&
      discordInteraction.commandName === this.name
    );
  }
}
