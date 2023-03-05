import { Interaction, MessageComponentInteraction } from 'discord.js';
import { ApplicationInteraction } from './ApplicationInteraction';
import {
  ApplicationInteractionInstance,
  ApplicationInteractionInstanceConstructor
} from './ApplicationInteractionInstance';
import { ShouldNeverHappenError } from '@sergiocabral/helper';
import { ApplicationInteractionInstanceMemory } from './ApplicationInteractionInstanceMemory';
import { ApplicationInteractionInstanceStep } from './ApplicationInteractionInstanceStep';

/**
 * Interação de Discord tratada pela aplicação trabalhada como instâncias individuais.
 */
export abstract class ApplicationInteractionAsInstance<
  TMemory extends ApplicationInteractionInstanceMemory
> extends ApplicationInteraction {
  /**
   * Identificador de uso geral.
   */
  public id: string = ApplicationInteraction.generateId(this.constructor.name);

  /**
   * Instâncias em execução.
   */
  protected instances: ApplicationInteractionInstance<TMemory>[] = [];

  /**
   * Lista de todos os passos de todas as instâncias.
   */
  private get allInstancesSteps(): ApplicationInteractionInstanceStep<TMemory>[] {
    return this.instances
      .map(instance => instance.steps)
      .reduce((result, current) => {
        result.push(...current);
        return result;
      }, []);
  }

  /**
   * Localiza um passo com base no Id.
   */
  private findStepById(
    id: string
  ): ApplicationInteractionInstanceStep<TMemory> | undefined {
    let step = this.instances.find(instance => instance.stepById[id])?.stepById[
      id
    ];

    if (step === undefined) {
      step = this.allInstancesSteps.find(step => id.startsWith(step.id));
    }

    return step;
  }

  /**
   * Construtor para instância.
   */
  protected abstract get instanceConstructor(): ApplicationInteractionInstanceConstructor<TMemory>;

  /**
   * Verifica se é uma interação do Discord que deve ser tratada a ponto de iniciar uma nova instância.
   * @param discordInteraction Interação do Discord.
   */
  protected abstract canStartHandle(
    discordInteraction: Interaction
  ): Promise<boolean> | boolean;

  /**
   * Verifica se é uma interação do Discord que deve ser tratada.
   * @param discordInteraction Interação do Discord.
   */
  public override canHandle(discordInteraction: Interaction): boolean {
    const customId =
      discordInteraction instanceof MessageComponentInteraction
        ? discordInteraction.customId
        : undefined;

    if (customId === undefined) {
      if (this.canStartHandle(discordInteraction)) {
        this.instances.push(
          new this.instanceConstructor(this, discordInteraction)
        );
        return true;
      }
      return false;
    } else {
      return this.findStepById(customId) !== undefined;
    }
  }

  /**
   * Trata a interação do Discord.
   * @param discordInteraction Interação do Discord.
   */
  public override async handle(discordInteraction: Interaction): Promise<void> {
    const customId =
      discordInteraction instanceof MessageComponentInteraction
        ? discordInteraction.customId
        : undefined;

    if (customId === undefined) {
      for (const instance of this.instances) {
        if (
          instance.discordInteraction === discordInteraction &&
          !instance.alreadyStartedHandle
        ) {
          await instance.startHandle(discordInteraction);
        }
      }
    } else {
      const step = this.findStepById(customId);

      if (step === undefined) {
        throw new ShouldNeverHappenError('Instance step not found.');
      }

      await step.handle(discordInteraction);
    }
  }
}
