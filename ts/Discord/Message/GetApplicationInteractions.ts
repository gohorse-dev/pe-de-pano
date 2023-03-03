import { Message } from '@sergiocabral/helper';
import { IApplicationInteraction } from '../ApplicationInteraction/IApplicationInteraction';

/**
 * Retorna a lista de todas as interações registradas.
 */
export class GetApplicationInteractions extends Message {
  /**
   * Lista de todas as interações.
   */
  public interactions?: IApplicationInteraction[];
}
