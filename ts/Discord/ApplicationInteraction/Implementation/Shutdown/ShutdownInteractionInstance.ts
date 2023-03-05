import { ApplicationInteractionInstance } from '../../ApplicationInteractionInstance';
import { ShutdownInteractionStepConfirmation } from './ShutdownInteractionStepConfirmation';
import { ShutdownInteractionInstanceMemory } from './ShutdownInteractionInstanceMemory';

/**
 * Instância individual. Desliga o bot como aplição em execução no sistema operacional.
 */
export class ShutdownInteractionInstance extends ApplicationInteractionInstance<ShutdownInteractionInstanceMemory> {
  /**
   * Memória da instância compartilhada entre as etapas.
   */
  public override readonly memory = new ShutdownInteractionInstanceMemory();

  /**
   * Primeira etapa de no tratamento da interação.
   */
  public override entryStepConstructor = ShutdownInteractionStepConfirmation;
}
