import { InvalidExecutionError } from '@sergiocabral/helper';
import { Interaction } from 'discord.js';
import { ApplicationInteractionAsInstance } from './ApplicationInteractionAsInstance';
import {
  ApplicationInteractionInstanceStep,
  ApplicationInteractionInstanceStepConstructor
} from './ApplicationInteractionInstanceStep';
import { ApplicationInteractionInstanceMemory } from './ApplicationInteractionInstanceMemory';
import { ApplicationInteraction } from './ApplicationInteraction';

/**
 * Construtor para ApplicationInteractionInstance
 */
export type ApplicationInteractionInstanceConstructor<
  TMemory extends ApplicationInteractionInstanceMemory
> = new (
  applicationInteraction: ApplicationInteractionAsInstance<TMemory>,
  discordInteraction: Interaction
) => ApplicationInteractionInstance<TMemory>;

/**
 * Classe base das instâncias de tratamento das interações do Discord.
 */
export abstract class ApplicationInteractionInstance<
  TMemory extends ApplicationInteractionInstanceMemory
> {
  /**
   * Construtor.
   * @param applicationInteraction Interação do aplicação.
   * @param discordInteraction Interação do Discord.
   */
  public constructor(
    public readonly applicationInteraction: ApplicationInteractionAsInstance<TMemory>,
    public readonly discordInteraction: Interaction
  ) {}

  /**
   * Identificador único desta instância.
   */
  private uniqueId: string = ApplicationInteraction.generateId(Math.random());

  /**
   * Identificador de uso geral.
   */
  public get id(): string {
    return `${this.applicationInteraction.id}|${this.uniqueId}`;
  }

  /**
   * Memória da instância compartilhada entre as etapas.
   */
  public abstract get memory(): TMemory;

  /**
   * Primeira etapa de no tratamento da interação.
   */
  protected abstract get entryStepConstructor(): ApplicationInteractionInstanceStepConstructor<TMemory>;

  /**
   * Lista de etapas usadas no tratamento da interação.
   */
  private readonly stepsValue: ApplicationInteractionInstanceStep<TMemory>[] =
    [];

  /**
   * Lista de etapas usadas no tratamento da interação.
   */
  public get steps(): ApplicationInteractionInstanceStep<TMemory>[] {
    return Array<ApplicationInteractionInstanceStep<TMemory>>().concat(
      this.stepsValue
    );
  }

  /**
   * Sinaliza que já começou a tratar a interação.
   */
  public get alreadyStartedHandle(): boolean {
    return this.stepsValue.length !== 0;
  }

  /**
   * Inicia o tratamento
   * @param discordInteraction Interação do Discord.
   */
  public async startHandle(discordInteraction: Interaction): Promise<void> {
    if (this.alreadyStartedHandle) {
      throw new InvalidExecutionError(
        'Already started handling the interaction..'
      );
    }
    const entryStep = new this.entryStepConstructor(this, discordInteraction);
    this.stepsValue.push(entryStep);
    await entryStep.handle(discordInteraction);
  }
}
