import type { ZodType } from 'zod';
import { _isValidJson } from './utils';

/**
 * A Storage API used to store and retrieve values from
 * localStorage or sessionStorage with optional type safety using Zod.
 */
export class TypedStorage {
  /** The storage linked to the item. Usually used as localStorage and sessionStorage. */
  private storage: globalThis.Storage;
  /** A string that determines the namespace used for every key within the object. */
  private namespace?: string;

  /**
   * @param storage - The storage type, commonly localStorage or sessionStorage
   * @param namespace - Optional namespace for keys
   */
  constructor(storage: globalThis.Storage, namespace?: string) {
    this.storage = storage;
    if (namespace) this.namespace = namespace;
  }

  /**
   * Returns a namespaced key.
   * @param key - The key to namespace.
   * @returns - The namespaced key.
   */
  private _getNamespacedKey(key: string): string {
    return this.namespace ? `${this.namespace}:${key}` : key;
  }

  /**
   * Gets the current namespace.
   * @returns - Can be undefined.
   */
  getNamespace(): string | undefined {
    return this.namespace;
  }

  /**
   * Sets a new namespace
   * @param namespace - The namespace
   */
  setNamespace(namespace: string): void {
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
  setItem<T>(key: string, value: T): void {
    const namespacedKey = this._getNamespacedKey(key);
    const isPrimitive = typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
    const toStoreValue = isPrimitive ? String(value) : JSON.stringify(value);
    this.storage.setItem(namespacedKey, toStoreValue);
  }

  /**
   * Stores a value in storage with an expiration time.
   * @param key - The key to store the value under.
   * @param value - The value to store. Can be anything.
   * @param ttl - Time to live in milliseconds.
   */
  setItemWithExpiration<T>(key: string, value: T, ttl: number): void {
    const namespacedKey = this._getNamespacedKey(key);
    this.setItem(key, value);
    setTimeout(() => this.storage.removeItem(namespacedKey), ttl);
  }

  /**
   * Retrieves a value from storage.
   * @template T - The expected type of the retrieved value.
   * @param key - The key to retrieve the value from.
   * @returns - The retrieved value or null if not found.
   */
  getItem<T = string>(key: string): T | null;
  /**
   * Retrieves a value from storage with a fallback.
   * @template T - The expected type of the retrieved value.
   * @param key - The key to retrieve the value from.
   * @param fallback - The fallback value if key is not found.
   * @returns - The retrieved value or fallback.
   */
  getItem<T>(key: string, fallback: T): T;
  /**
   * Retrieves a value from storage with a fallback and Zod validation.
   * @template T - The expected type of the retrieved value.
   * @param key - The key to retrieve the value from.
   * @param fallback - The fallback value if key is not found or does not match the schema.
   * @param schema - Zod schema to validate the parsed value.
   * @returns - The retrieved value or fallback.
   */
  getItem<T>(key: string, fallback: T, schema: ZodType<T>): T;
  getItem<T>(key: string, fallback?: T, schema?: ZodType<T>): T | null {
    const namespacedKey = this._getNamespacedKey(key);
    const item = this.storage.getItem(namespacedKey);

    if (item === null) return fallback ?? null;

    const parsed = _isValidJson(item) ? JSON.parse(item) : item;

    if (schema) {
      const result = schema.safeParse(parsed);
      return result.success ? result.data : (fallback as T);
    }

    return parsed as T;
  }

  /** Returns the current storage */
  getStorage(): globalThis.Storage {
    return this.storage;
  }

  /**
   * Removes a key from storage.
   * @param key - The key to remove.
   */
  removeItem(key: string): void {
    const namespacedKey = this._getNamespacedKey(key);
    this.storage.removeItem(namespacedKey);
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
  itemExists(key: string): boolean {
    const namespacedKey = this._getNamespacedKey(key);
    return this.storage.getItem(namespacedKey) !== null;
  }

  /** Gets the number of items in storage */
  length(): number {
    return this.storage.length;
  }
}
