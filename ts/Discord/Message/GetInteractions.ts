import { Message } from '@sergiocabral/helper';
import { IInteractionBase } from '../Interaction/IInteractionBase';

/**
 * Retorna a lista de todas as interações registradas.
 */
export class GetInteractions extends Message {
  /**
   * Lista de todas as interações.
   */
  public interactions?: IInteractionBase[];
}
