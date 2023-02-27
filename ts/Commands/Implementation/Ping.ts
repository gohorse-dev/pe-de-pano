import { Command } from '../Command';

export class Ping extends Command {
  /**
   * Nome.
   */
  public override name = 'ping';

  /**
   * Descrição.
   */
  public description = 'A ping-pong command.'.translate();
}
