import { beforeEach } from 'vitest';
import { TypedStorage } from '../lib/index';

const localStorageInstance = new TypedStorage(localStorage);
const sessionStorageInstance = new TypedStorage(sessionStorage);

beforeEach(() => {
  localStorageInstance.clear();
  sessionStorageInstance.clear();
});
