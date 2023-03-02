import { MarketDataResult } from './Model/MarketDataResult';
import {
  HelperText,
  InvalidDataError,
  Logger,
  LogLevel,
  Message
} from '@sergiocabral/helper';
import { GetDominosPizzaPrice } from './Message/GetDominosPizzaPrice';

/**
 * Serviços envolvendo a Dominos Pizza
 */
export class DominosPizzaService {
  /**
   * Contexto de log.
   */
  private static logContext = 'DominosPizzaService';

  /**
   * Construtor.
   */
  public constructor() {
    this.subscribeToMessages();
  }

  /**
   * Se inscreve nas mensagens de interesse.
   */
  private subscribeToMessages(): void {
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
    try {
      message.price = await this.getPizzaPrice();
    } catch (error) {
      Logger.post(
        "The price of Domino's Pizza could not be delivered as a result in the message.",
        undefined,
        LogLevel.Warning,
        DominosPizzaService.logContext
      );
    }
  }

  /**
   * Retorna o preço da pizza.
   */
  private async getPizzaPrice(): Promise<string> {
    const dominosData = await this.getMarketData();

    if (dominosData.homeTiles?.tiles !== undefined) {
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
            return price.replace(regexBeforeDigit, ' ');
          }
        }
      }
    }

    Logger.post(
      "Unable to extract price of Domino's Pizza API. Original content: {content}",
      { content: JSON.stringify(dominosData) },
      LogLevel.Error,
      DominosPizzaService.logContext
    );

    throw new InvalidDataError(
      "No data received from the Domino's Pizza API for the price of the pizza."
    );
  }

  /**
   * Retorna os dados da API da Domino's Pizza.
   */
  private async getMarketData(): Promise<MarketDataResult> {
    const url = 'https://cache.dominos.com/wam/prod/market/BR/_pt/dpz.wam.js';

    Logger.post(
      'Loading data from the Domino\'s Pizza API in "{url}".',
      {
        url
      },
      LogLevel.Verbose,
      DominosPizzaService.logContext
    );

    const response = await fetch(url);
    const content = await response.text();

    const regexExtractJson = /return\s+({.*?})\s*;\s*}\s*\)\s*;\s*$/;
    const jsonAsText = (content.match(regexExtractJson) ?? [])[1];

    if (jsonAsText === undefined) {
      Logger.post(
        "The return from the Domino's Pizza API did not return as expected: {content}",
        { content },
        LogLevel.Error,
        DominosPizzaService.logContext
      );

      throw new InvalidDataError(
        "The return from the Domino's Pizza API did not return as expected."
      );
    }

    try {
      const json = JSON.parse(jsonAsText) as MarketDataResult;

      Logger.post(
        "Data from the Domino's Pizza API was loaded with {lengthBytes} bytes.",
        {
          lengthBytes: jsonAsText.length
        },
        LogLevel.Verbose,
        DominosPizzaService.logContext
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
        DominosPizzaService.logContext
      );

      throw error;
    }
  }
}
