import { Interaction } from 'discord.js';
import { ApplicationInteractionInstanceStep } from '../../ApplicationInteractionInstanceStep';
import { ShutdownInteractionInstanceMemory } from './ShutdownInteractionInstanceMemory';

/**
 * Resposta Não para a pergunta de confirmação.
 * Desliga o bot como aplição em execução no sistema operacional.
 */
export class ShutdownInteractionStepAnswerNo extends ApplicationInteractionInstanceStep<ShutdownInteractionInstanceMemory> {
  /**
   * Trata a interação do Discord.
   * @param discordInteraction Interação do Discord.
   */
  public override async handle(discordInteraction: Interaction): Promise<void> {
    if (discordInteraction.isRepliable()) {
      await discordInteraction.reply({
        content: 'Phew! What a fright.'.translate(),
        ephemeral: true
      });
    }
  }
}
