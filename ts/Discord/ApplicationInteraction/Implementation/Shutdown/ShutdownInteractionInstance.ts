import { ApplicationInteractionInstance } from '../../ApplicationInteractionInstance';
import { ShutdownInteractionStepQuestion } from './ShutdownInteractionStepQuestion';
import { ShutdownInteractionInstanceMemory } from './ShutdownInteractionInstanceMemory';

/**
 * Desliga o bot como aplição em execução no sistema operacional.
 */
export class ShutdownInteractionInstance extends ApplicationInteractionInstance<ShutdownInteractionInstanceMemory> {
  /**
   * Memória da instância compartilhada entre as etapas.
   */
  public override readonly memory = new ShutdownInteractionInstanceMemory();

  /**
   * Primeira etapa de no tratamento da interação.
   */
  public override entryStepConstructor = ShutdownInteractionStepQuestion;
}
