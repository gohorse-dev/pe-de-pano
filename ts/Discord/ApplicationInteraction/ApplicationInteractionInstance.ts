import { InvalidExecutionError } from '@sergiocabral/helper';
import { Interaction, InteractionResponse, REST } from 'discord.js';
import { ApplicationInteractionAsInstance } from './ApplicationInteractionAsInstance';
import {
  ApplicationInteractionInstanceStep,
  ApplicationInteractionInstanceStepConstructor
} from './ApplicationInteractionInstanceStep';
import { ApplicationInteractionInstanceMemory } from './ApplicationInteractionInstanceMemory';
import { ApplicationInteraction } from './ApplicationInteraction';
import { Queue } from '../../Helper/Queue';
import { GetDiscordRestInstance } from '../Message/GetDiscordRestInstance';
import { Listener, ListenerFunction } from '../../Helper/Listener';

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
    discordInteraction: Interaction
  ) {
    this.discordInteractions.enqueueIfNotExists(discordInteraction);
  }

  /**
   * Obtem a instância para requisição REST com o Discord
   */
  public async discordRest(): Promise<REST> {
    const rest = (await new GetDiscordRestInstance().sendAsync()).message.rest;
    if (rest === undefined) {
      throw new InvalidExecutionError('Discord REST instance was not defined.');
    }
    return rest;
  }

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
   * Fila de interações do Discord.
   */
  public discordInteractions = new Queue<Interaction>();

  /**
   * Fila de repostas das interações do Discord.
   */
  public discordInteractionsResponses = new Queue<InteractionResponse>();

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
   * Lista de etapas associadas a um id.
   */
  public readonly stepById: Record<
    string,
    ApplicationInteractionInstanceStep<TMemory>
  > = {};

  /**
   * Sinaliza que já começou a tratar a interação.
   */
  public get alreadyStartedHandle(): boolean {
    return this.stepsValue.length !== 0;
  }

  /**
   * Inicia o tratamento da interação do Discord com o passo de entrada.
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

  /**
   * Adicionar um passo e associa a identificadores.
   * @param step Passo.
   * @param ids Ids associados.
   */
  public addStep(
    step: ApplicationInteractionInstanceStep<TMemory>,
    ...ids: string[]
  ) {
    this.stepsValue.push(step);
    for (const id of ids) {
      this.stepById[id] = step;
    }
  }

  /**
   * Listeners para dispose.
   */
  private disposeListeners = new Set<
    ListenerFunction<ApplicationInteractionInstance<TMemory>>
  >();

  /**
   * Listener para evento de dispose.
   */
  public disposeListener = new Listener<
    ApplicationInteractionInstance<TMemory>
  >(this.disposeListeners);

  /**
   * Sinaliza que já foi liberado.
   */
  private isDisposedValue = false;

  /**
   * Sinaliza que já foi liberado.
   */
  public get isDisposed() {
    return this.isDisposedValue;
  }

  /**
   * Liberação de recursos.
   */
  protected abstract doDispose(): Promise<void> | void;

  /**
   * Liberação de recursos.
   */
  public async dispose(): Promise<void> {
    if (this.isDisposedValue) {
      throw new InvalidExecutionError('This instance already disposed.');
    }

    await this.doDispose();

    this.stepsValue.length = 0;
    for (const key of Object.keys(this.stepById)) {
      delete this.stepById[key];
    }

    this.discordInteractions.clear();
    this.discordInteractionsResponses.clear();

    this.isDisposedValue = true;

    for (const disposeListener of this.disposeListeners) {
      await disposeListener(this);
    }
  }
}
