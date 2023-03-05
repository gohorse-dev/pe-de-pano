import { Interaction } from 'discord.js';
import { ApplicationInteractionCommand } from '../../ApplicationInteractionCommand';
import { ApplicationInteractionAsInstance } from '../../ApplicationInteractionAsInstance';
import { ShutdownInteractionInstance } from './ShutdownInteractionInstance';
import { ShutdownInteractionInstanceMemory } from './ShutdownInteractionInstanceMemory';

/**
 * Desliga o bot como aplição em execução no sistema operacional.
 */
export class ShutdownInteraction extends ApplicationInteractionAsInstance<ShutdownInteractionInstanceMemory> {
  /**
   * Informações como comando (se aplicável).
   */
  public override command = new ApplicationInteractionCommand(
    'shutdown',
    'Turn off this bot.'
  );

  /**
   * Construtor para instância.
   */
  protected override instanceConstructor = ShutdownInteractionInstance;

  /**
   * Verifica se é uma interação do Discord que deve ser tratada.
   * @param discordInteraction Interação do Discord.
   */
  protected override canStartHandle(discordInteraction: Interaction): boolean {
    return this.command.canHandle(discordInteraction);
  }
}
