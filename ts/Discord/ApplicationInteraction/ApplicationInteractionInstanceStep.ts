import { Interaction, InteractionResponse } from 'discord.js';
import { ApplicationInteractionInstance } from './ApplicationInteractionInstance';
import { ApplicationInteractionInstanceMemory } from './ApplicationInteractionInstanceMemory';
import { ApplicationInteraction } from './ApplicationInteraction';

/**
 * Construtor para ApplicationInteractionInstance
 */
export type ApplicationInteractionInstanceStepConstructor<
  TMemory extends ApplicationInteractionInstanceMemory
> = new (
  applicationInteractionInstance: ApplicationInteractionInstance<TMemory>,
  discordInteraction: Interaction
) => ApplicationInteractionInstanceStep<TMemory>;

/**
 * Classe base para uma etapa gerenciada por uma instância de tratamento das interações do Discord.
 */
export abstract class ApplicationInteractionInstanceStep<
  TMemory extends ApplicationInteractionInstanceMemory
> {
  /**
   * Construtor.
   * @param applicationInteractionInstance Instância da interação da aplicação.
   * @param discordInteraction Interação do Discord.
   */
  public constructor(
    public readonly applicationInteractionInstance: ApplicationInteractionInstance<TMemory>,
    discordInteraction: Interaction
  ) {
    this.applicationInteractionInstance.discordInteractions.enqueueIfNotExists(
      discordInteraction
    );
  }

  /**
   * Identificador desta etapa.
   */
  private myId: string = ApplicationInteraction.generateId(
    this.constructor.name
  );

  /**
   * Identificador de uso geral.
   */
  public get id(): string {
    return `${this.applicationInteractionInstance.id}|${this.myId}`;
  }

  /**
   * Trata a interação do Discord.
   * @param discordInteraction Interação do Discord.
   */
  protected abstract doHandle(
    discordInteraction: Interaction
  ): Promise<InteractionResponse>;

  /**
   * Trata a interação do Discord.
   * @param discordInteraction Interação do Discord.
   */
  public async handle(discordInteraction: Interaction): Promise<void> {
    this.applicationInteractionInstance.discordInteractions.enqueueIfNotExists(
      discordInteraction
    );
    const discordInteractionResponse = await this.doHandle(discordInteraction);
    this.applicationInteractionInstance.discordInteractionsResponses.enqueueIfNotExists(
      discordInteractionResponse
    );
  }
}
