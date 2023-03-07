/**
 * Tipo da função usada no listener.
 */
export type ListenerFunction<T> = (arg: T) => Promise<void> | void;

/**
 * Listener para eventos.
 */
export class Listener<T> {
  /**
   * Construtor.
   * @param listeners Lista dos listeners cadastrados.
   */
  public constructor(private readonly listeners: Set<ListenerFunction<T>>) {}

  public on(listener: ListenerFunction<T>): void {
    this.listeners.add(listener);
  }

  public off(listener: ListenerFunction<T>): void {
    this.listeners.delete(listener);
  }
}
