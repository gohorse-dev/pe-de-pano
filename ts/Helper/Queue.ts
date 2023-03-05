/**
 * Fila de itens.
 */
export class Queue<T> {
  /**
   * Instância da fila.
   */
  private value: T[] = [];

  /**
   * Fila de itens.
   */
  public get queue(): T[] {
    return Array<T>().concat(this.value);
  }

  /**
   * Primeiro item da fila.
   */
  public first(forward = 0): T | undefined {
    return this.value[forward];
  }

  /**
   * Último item da fila.
   */
  public last(rewind = 0): T | undefined {
    return this.value[this.value.length - 1 - rewind];
  }

  /**
   * Adiciona um item na fila.
   */
  public enqueueIfNotExists(item: T): void {
    if (!this.value.includes(item)) {
      this.value.push(item);
    }
  }
}
