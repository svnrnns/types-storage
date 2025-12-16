import { TypeSafeStorage } from './TypeSafeStorage';

const defaultStorage = new TypeSafeStorage(localStorage);

const get: TypeSafeStorage['get'] = (...args) => defaultStorage.get(...args);
const set: TypeSafeStorage['set'] = (...args) => defaultStorage.set(...args);
const setWithExpiration: TypeSafeStorage['setWithExpiration'] = (...args) => defaultStorage.setWithExpiration(...args);
const exists: TypeSafeStorage['exists'] = (...args) => defaultStorage.exists(...args);
const remove: TypeSafeStorage['remove'] = (...args) => defaultStorage.remove(...args);
const clear: TypeSafeStorage['clear'] = () => defaultStorage.clear();
const length: TypeSafeStorage['length'] = () => defaultStorage.length();

export { TypeSafeStorage, get, set, setWithExpiration, exists, remove, clear, length };
