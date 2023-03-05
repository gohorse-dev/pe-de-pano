import { Interaction } from 'discord.js';
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
    public readonly discordInteraction: Interaction
  ) {}

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
   * Trata a interação.
   * @param discordInteraction Interação chegada do discord.
   */
  public abstract handle(discordInteraction: Interaction): Promise<void>;
}
