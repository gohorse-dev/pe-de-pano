import { Message } from '@sergiocabral/helper';

/**
 * Retorna o preço da pizzaa da Dominos.
 */
export class GetDominosPizzaPrice extends Message {
  /**
   * Preço da pizza.
   */
  public price?: string;
}
