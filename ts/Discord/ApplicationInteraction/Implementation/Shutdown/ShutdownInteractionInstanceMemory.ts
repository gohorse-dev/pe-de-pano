import { ApplicationInteractionInstanceMemory } from '../../ApplicationInteractionInstanceMemory';
import { ApplicationInteraction } from '../../ApplicationInteraction';

/**
 * Memória compartilhada entre etapas. Desliga o bot como aplição em execução no sistema operacional.
 */
export class ShutdownInteractionInstanceMemory extends ApplicationInteractionInstanceMemory {
  /**
   * Identificado do botão Sim
   */
  private static buttonYesId = ApplicationInteraction.generateId('buttonYes');

  /**
   * Identificado do botão Sim
   */
  public buttonYesId = ShutdownInteractionInstanceMemory.buttonYesId;

  /**
   * Identificado do botão Sim
   */
  private static buttonNoId = ApplicationInteraction.generateId('buttonNo');

  /**
   * Identificado do botão Sim
   */
  public buttonNoId = ShutdownInteractionInstanceMemory.buttonNoId;
}
