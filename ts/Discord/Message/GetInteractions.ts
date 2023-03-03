import { Message } from '@sergiocabral/helper';
import { IApplicationInteraction } from '../Interaction/IApplicationInteraction';

/**
 * Retorna a lista de todas as interações registradas.
 */
export class GetInteractions extends Message {
  /**
   * Lista de todas as interações.
   */
  public interactions?: IApplicationInteraction[];
}
