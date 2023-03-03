import { Message } from '@sergiocabral/helper';
import { IInteractionBase } from '../Interaction/IInteractionBase';

/**
 * Sinaliza que as interações com o Discord foram carregadas.
 */
export class InteractionsLoaded extends Message {
  /**
   * Construtor.
   * @param interactions Interações com o Discord carregadas.
   */
  public constructor(public readonly interactions: IInteractionBase[]) {
    super();
  }
}
