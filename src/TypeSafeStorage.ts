export class TypeSafeStorage {
  /** The storage linked to the item. Usually used as localStorage and sessionStorage. */
  private storage: Storage;
  /** A string that determines the namespace used for every key within the object. */
  private namespace?: string;

  /**
   * @param storage - The storage type, commonly localSotrage or sessionStorage
   * @param namespace - Optional namespace for keys
   */
  constructor(storage: Storage, namespace?: string) {
    this.storage = storage;
    if (namespace) this.namespace = namespace;
  }

  /**
   * Returns a namespaced key.
   * @param key - The key to namespace.
   * @returns - The namespaced key.
   */
  private getNamespacedKey(key: string): string {
    return this.namespace ? `${this.namespace}:${key}` : key;
  }

  /**
   * Gets the current namespace.
   * @returns - Can be undefined.
   */
  public getNamespace(): string | undefined {
    return this.namespace;
  }

  /**
   * Sets a new namespace
   * @param namespace - The namespace
   */
  public setNamespace(namespace: string): void {
    if (typeof namespace === 'string') {
      this.namespace = namespace;
    }
  }

  /**
   * Check if the storage is available.
   * @returns - True if available, false otherwise.
   */
  static isAvailable(): boolean {
    try {
      const testKey = '__test';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Stores a value in storage.
   * @param key - The key to store the value under.
   * @param value - The value to store. Can be anything.
   */
  set<T>(key: string, value: T): void {
    const namespacedKey = this.getNamespacedKey(key);
    this.storage.setItem(namespacedKey, JSON.stringify(value));
  }

  /**
   * Stores a value in storage with an expiration time.
   * @param key - The key to store the value under.
   * @param value - The value to store. Can be anything.
   * @param ttl - Time to live in milliseconds.
   */
  setWithExpiration<T>(key: string, value: T, ttl: number): void {
    const namespacedKey = this.getNamespacedKey(key);
    this.storage.setItem(namespacedKey, JSON.stringify(value));
    setTimeout(() => this.storage.removeItem(namespacedKey), ttl);
  }

  /**
   * Retrieves a value from storage.
   * @param key - The key to retrieve the value from.
   * @param fallback - The fallback value if key is not found or does not match the specified T.
   * @param validator - An optional validator function.
   * @returns - The retrieved value or fallback.
   */
  get<T>(key: string, fallback: T, validator?: (value: any) => boolean): T {
    const namespacedKey = this.getNamespacedKey(key);
    const item = this.storage.getItem(namespacedKey);
    if (item === null) return fallback;

    try {
      const parsed = JSON.parse(item);
      if (validator ? validator(parsed) : typeof parsed === typeof fallback) {
        return parsed as T;
      }
    } catch {
      // JSON parsing failed, fallback to default value
    }

    return fallback;
  }

  /**
   * Removes a key from storage.
   * @param key - The key to remove.
   */
  remove(key: string): void {
    const namespacedKey = this.getNamespacedKey(key);
    this.storage.removeItem(this.getNamespacedKey(namespacedKey));
  }

  /** Removes all keys from storage. */
  clear(): void {
    this.storage.clear();
  }

  /**
   * Checks if a key exists in storage.
   * @param key - The key to check.
   * @returns - True if exists, false otherwise.
   */
  exists(key: string): boolean {
    const namespacedKey = this.getNamespacedKey(key);
    return this.storage.getItem(namespacedKey) !== null;
  }

  /** Gets the number of items in storage */
  length(): number {
    return this.storage.length;
  }
}
