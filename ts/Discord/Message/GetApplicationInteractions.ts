import { Message } from '@sergiocabral/helper';
import { ApplicationInteraction } from '../ApplicationInteraction/ApplicationInteraction';

/**
 * Retorna a lista de todas as interações registradas.
 */
export class GetApplicationInteractions extends Message {
  /**
   * Lista de todas as interações.
   */
  public interactions?: ApplicationInteraction[];
}
