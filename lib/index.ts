import { TypedStorage } from './typed-storage';

const defaultStorage = new TypedStorage(localStorage);

const getItem = defaultStorage.getItem.bind(defaultStorage);
const setItem = defaultStorage.setItem.bind(defaultStorage);
const setItemWithExpiration = defaultStorage.setItemWithExpiration.bind(defaultStorage);
const itemExists = defaultStorage.itemExists.bind(defaultStorage);
const removeItem = defaultStorage.removeItem.bind(defaultStorage);
const clear = defaultStorage.clear.bind(defaultStorage);
const length = defaultStorage.length.bind(defaultStorage);

export { TypedStorage, getItem, setItem, setItemWithExpiration, itemExists, removeItem, clear, length };
