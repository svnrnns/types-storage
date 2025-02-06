import { TypeSafeStorage } from './TypeSafeStorage';

const defaultStorage = new TypeSafeStorage(localStorage);

const get = <T>(key: string, fallback: T, validator?: (value: any) => boolean): T =>
  defaultStorage.get(key, fallback, validator);

const set = <T>(key: string, value: T): void => defaultStorage.set(key, value);

const setWithExpiration = <T>(key: string, value: T, ttl: number): void =>
  defaultStorage.setWithExpiration(key, value, ttl);

const exists = (key: string): boolean => defaultStorage.exists(key);

const remove = (key: string): void => defaultStorage.remove(key);

const clear = (): void => defaultStorage.clear();

const length = (): number => defaultStorage.length();

export { TypeSafeStorage, get, set, setWithExpiration, exists, remove, clear, length };
