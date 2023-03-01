import { Message } from '@sergiocabral/helper';
import { IInteractionHandler } from '../Interaction/IInteractionHandler';

/**
 * Retorna a lista de todas as interações registradas.
 */
export class GetAllInteractions extends Message {
  /**
   * Lista de todas as interações.
   */
  public allInteractions?: IInteractionHandler[];
}
