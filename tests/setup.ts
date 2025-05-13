import { beforeEach } from 'vitest';
import { TypeSafeStorage } from '../lib/index';

const localStorageInstance = new TypeSafeStorage(localStorage);
const sessionStorageInstance = new TypeSafeStorage(sessionStorage);

beforeEach(() => {
  localStorageInstance.clear();
  sessionStorageInstance.clear();
});
