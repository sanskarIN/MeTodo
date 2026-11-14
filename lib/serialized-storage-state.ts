/**
 * Serializes reads and writes for one AsyncStorage key.
 *
 * Hydration always finishes before the first mutation. Updates are applied
 * against the latest successfully persisted snapshot, not a stale React render.
 * A failed write rejects and leaves the previous snapshot intact.
 */
export interface KeyValueStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}

export class SerializedStorageState<T> {
  private snapshot: T;
  private hydrated = false;
  private tail: Promise<void> = Promise.resolve();

  constructor(
    private readonly storage: KeyValueStorage,
    private readonly key: string,
    initialValue: T,
    private readonly reviver?: (key: string, value: unknown) => unknown,
  ) {
    this.snapshot = initialValue;
  }

  private async hydrate(): Promise<void> {
    if (this.hydrated) return;
    const saved = await this.storage.getItem(this.key);
    if (saved !== null) {
      // Fail closed on corrupt data rather than overwriting it with defaults.
      this.snapshot = JSON.parse(saved, this.reviver) as T;
    }
    this.hydrated = true;
  }

  private enqueue<R>(operation: () => Promise<R>): Promise<R> {
    const result = this.tail.then(operation);
    // Recover the queue for future operations without suppressing caller errors.
    this.tail = result.then(() => undefined, () => undefined);
    return result;
  }

  load(): Promise<T> {
    return this.enqueue(async () => {
      await this.hydrate();
      return this.snapshot;
    });
  }

  mutate(update: (current: T) => T): Promise<T> {
    return this.enqueue(async () => {
      await this.hydrate();
      const next = update(this.snapshot);
      await this.storage.setItem(this.key, JSON.stringify(next));
      this.snapshot = next;
      return next;
    });
  }

  replace(next: T): Promise<T> {
    return this.mutate(() => next);
  }

  /**
   * Explicit, user-requested recovery/reset. Bypasses hydration so corrupt
   * persisted JSON never makes the "clear data" action impossible.
   */
  reset(next: T): Promise<T> {
    return this.enqueue(async () => {
      await this.storage.setItem(this.key, JSON.stringify(next));
      this.snapshot = next;
      this.hydrated = true;
      return next;
    });
  }
}
