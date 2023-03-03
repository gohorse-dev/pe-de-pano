import { Message } from '@sergiocabral/helper';
import { IApplicationInteraction } from '../Interaction/IApplicationInteraction';

/**
 * Sinaliza que as interações com o Discord foram carregadas.
 */
export class InteractionsLoaded extends Message {
  /**
   * Construtor.
   * @param interactions Interações com o Discord carregadas.
   */
  public constructor(public readonly interactions: IApplicationInteraction[]) {
    super();
  }
}
