import { TypedStorage } from './typed-storage';

const defaultStorage = new TypedStorage(localStorage);

const getItem: TypedStorage['getItem'] = (...args) => defaultStorage.getItem(...args);
const setItem: TypedStorage['setItem'] = (...args) => defaultStorage.setItem(...args);
const setItemWithExpiration: TypedStorage['setItemWithExpiration'] = (...args) =>
  defaultStorage.setItemWithExpiration(...args);
const itemExists: TypedStorage['itemExists'] = (...args) => defaultStorage.itemExists(...args);
const removeItem: TypedStorage['removeItem'] = (...args) => defaultStorage.removeItem(...args);
const clear: TypedStorage['clear'] = () => defaultStorage.clear();
const length: TypedStorage['length'] = () => defaultStorage.length();

export { TypedStorage, getItem, setItem, setItemWithExpiration, itemExists, removeItem, clear, length };
