import { Command } from '../Command';

export class Hello extends Command {
  /**
   * Nome.
   */
  public override name = 'hello';

  /**
   * Descrição.
   */
  public description = 'A Hello World command.'.translate();
}
