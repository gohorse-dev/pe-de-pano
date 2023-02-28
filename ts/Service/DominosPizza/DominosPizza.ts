import { MarketDataResult } from '../../Model/DominosPizza/MarketDataResult';
import { InvalidDataError, Message, RequestError } from '@sergiocabral/helper';
import { GetDominosPizzaPrice } from '../../Message/DominosPizza/GetDominosPizzaPrice';

/**
 * Serviços envolvendo a Dominos Pizza
 */
export class DominosPizza {
  /**
   * Construtor.
   */
  public constructor() {
    Message.subscribe(
      GetDominosPizzaPrice,
      this.handleGetDominosPizzaPrice.bind(this)
    );
  }

  /**
   * Mensagem: GetDominosPizzaPrice
   */
  private async handleGetDominosPizzaPrice(
    message: GetDominosPizzaPrice
  ): Promise<void> {
    const dominosData = await this.getMarketData();
    const regexExtractPrice = /R\$\s*?\d+[,.]\d{2}/;

    for (const entry of Object.entries(dominosData.homeTiles.tiles)) {
      const tile = entry[1];
      if (tile.linkCode === 'BYOM') {
        const price = (regexExtractPrice.exec(tile.images.side.alt) ?? [])[0];

        if (price !== undefined) {
          message.price = price;
          return;
        }
      }
    }

    throw new InvalidDataError("Unable to extract price of Domino's Pizza.");

    // TODO: Substituir throw por log de erro.
  }

  private async getMarketData(): Promise<MarketDataResult> {
    const url = 'https://cache.dominos.com/wam/prod/market/BR/_pt/dpz.wam.js';
    const response = await fetch(url);
    const content = await response.text();

    const regexExtractJson = /return\s+({.*?})\s*;\s*}\s*\)\s*;\s*$/;
    const jsonAsText = (content.match(regexExtractJson) ?? [])[1];

    if (jsonAsText === undefined) {
      throw new RequestError(
        "The return from the Domino's Pizza API did not return as expected."
      );
    }

    try {
      return JSON.parse(jsonAsText) as MarketDataResult;
    } catch (error) {
      throw new InvalidDataError(
        "The return data from the Domino's Pizza API is not valid JSON."
      );
    }
  }
}
