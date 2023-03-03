import { Message } from '@sergiocabral/helper';
import { IInteractionHandler } from '../../../js/Discord/Interaction/IInteractionHandler';

/**
 * Sinaliza que as interações com o Discord foram carregadas.
 */
export class InteractionLoaded extends Message {
  /**
   * Construtor.
   * @param interactions Interações com o Discord carregadas.
   */
  public constructor(public readonly interactions: IInteractionHandler[]) {
    super();
  }
}
