import { describe, beforeEach, it, expect } from 'vitest';
import { TypedStorage } from '../lib/index';
import * as z from 'zod';

describe('Boolean TypedStorage', () => {
  const localStorageInstance = new TypedStorage(localStorage, 'test');
  const sessionStorageInstance = new TypedStorage(sessionStorage, 'test');

  [localStorageInstance, sessionStorageInstance].forEach((storage, index) => {
    const storageType = index === 0 ? 'localStorage' : 'sessionStorage';

    describe(`${storageType}`, () => {
      describe('set', () => {
        beforeEach(() => {
          storage.clear();
          expect(storage.length()).toBe(0);
        });

        it('a true boolean', () => {
          storage.setItem('enabled', true);
          expect(storage.getStorage().getItem('test:enabled')).toBe('true');
        });

        it('a false boolean', () => {
          storage.setItem('disabled', false);
          expect(storage.getStorage().getItem('test:disabled')).toBe('false');
        });

        it('a boolean array', () => {
          storage.setItem('flags', [true, false, true]);
          expect(storage.getStorage().getItem('test:flags')).toBe('[true,false,true]');
        });
      });

      describe('get', () => {
        beforeEach(() => {
          storage.clear();
          expect(storage.length()).toBe(0);
        });

        it('a boolean primitive', () => {
          storage.setItem('enabled', true);
          const schema = z.boolean();
          const result = storage.getItem('enabled', false, schema);
          expect(result).toBe(true);
        });

        it('a boolean primitive fallback', () => {
          storage.setItem('enabled', 'not-a-boolean');
          const schema = z.boolean();
          const result = storage.getItem('enabled', false, schema);
          expect(result).toBe(false);
        });

        it('a boolean array', () => {
          storage.setItem('flags', [true, false, true]);
          const schema = z.array(z.boolean());
          const result = storage.getItem('flags', [false], schema);
          expect(result).toEqual([true, false, true]);
        });

        it('a boolean array fallback', () => {
          storage.setItem('flags', [true, 'invalid', false]);
          const schema = z.array(z.boolean());
          const result = storage.getItem('flags', [false], schema);
          expect(result).toEqual([false]);
        });
      });
    });
  });
});
