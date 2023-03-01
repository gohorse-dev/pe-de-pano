import { MarketDataResult } from '../../Model/DominosPizza/MarketDataResult';
import { HelperText, Logger, LogLevel, Message } from '@sergiocabral/helper';
import { GetDominosPizzaPrice } from '../../Message/DominosPizza/GetDominosPizzaPrice';

/**
 * Serviços envolvendo a Dominos Pizza
 */
export class DominosPizza {
  /**
   * Contexto de log.
   */
  private static logContext = 'DominosPizza';

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
    if (dominosData?.homeTiles?.tiles === undefined) {
      Logger.post(
        "No data received from the Domino's Pizza API for the price of the pizza.",
        undefined,
        LogLevel.Warning,
        DominosPizza.logContext
      );

      return;
    }

    const regexExtractPrice = /R\$\s*?\d+[,.]\d{2}/;

    for (const entry of Object.entries(dominosData.homeTiles.tiles)) {
      const tile = entry[1];
      if (
        tile?.linkCode === 'BYOM' &&
        typeof tile?.images?.side?.alt === 'string'
      ) {
        const price = (regexExtractPrice.exec(tile.images.side.alt) ?? [])[0];

        if (price !== undefined) {
          const regexBeforeDigit = /(?=\d)/;
          message.price = price.replace(regexBeforeDigit, ' ');
          return;
        }
      }
    }

    Logger.post(
      "Unable to extract price of Domino's Pizza API.",
      undefined,
      LogLevel.Warning,
      DominosPizza.logContext
    );
  }

  private async getMarketData(): Promise<MarketDataResult | undefined> {
    const url = 'https://cache.dominos.com/wam/prod/market/BR/_pt/dpz.wam.js';

    Logger.post(
      'Loading data from the Domino\'s Pizza API in "{url}".',
      {
        url
      },
      LogLevel.Verbose,
      DominosPizza.logContext
    );

    const response = await fetch(url);
    const content = await response.text();

    const regexExtractJson = /return\s+({.*?})\s*;\s*}\s*\)\s*;\s*$/;
    const jsonAsText = (content.match(regexExtractJson) ?? [])[1];

    if (jsonAsText === undefined) {
      Logger.post(
        "The return from the Domino's Pizza API did not return as expected.",
        undefined,
        LogLevel.Error,
        DominosPizza.logContext
      );

      return undefined;
    }

    try {
      const json = JSON.parse(jsonAsText) as MarketDataResult;

      Logger.post(
        "Data from the Domino's Pizza API was loaded with {lengthBytes} bytes.",
        {
          lengthBytes: jsonAsText.length
        },
        LogLevel.Verbose,
        DominosPizza.logContext
      );

      return json;
    } catch (error) {
      Logger.post(
        "The return data from the Domino's Pizza API is not valid JSON: {errorDescription}",
        {
          errorDescription: HelperText.formatError(error),
          error
        },
        LogLevel.Error,
        DominosPizza.logContext
      );

      return undefined;
    }
  }
}
