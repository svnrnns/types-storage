import { describe, beforeEach, it, expect } from 'vitest';
import { TypeSafeStorage } from '../lib/index';
import * as z from 'zod';

describe('Boolean Storage', () => {
  const localStorageInstance = new TypeSafeStorage(localStorage, 'test');
  const sessionStorageInstance = new TypeSafeStorage(sessionStorage, 'test');

  [localStorageInstance, sessionStorageInstance].forEach((storage, index) => {
    const storageType = index === 0 ? 'localStorage' : 'sessionStorage';

    describe(`${storageType}`, () => {
      describe('set', () => {
        beforeEach(() => {
          storage.clear();
          expect(storage.length()).toBe(0);
        });

        it('a true boolean', () => {
          storage.set('enabled', true);
          expect(storage.getStorage().getItem('test:enabled')).toBe('true');
        });

        it('a false boolean', () => {
          storage.set('disabled', false);
          expect(storage.getStorage().getItem('test:disabled')).toBe('false');
        });

        it('a boolean array', () => {
          storage.set('flags', [true, false, true]);
          expect(storage.getStorage().getItem('test:flags')).toBe('[true,false,true]');
        });
      });

      describe('get', () => {
        beforeEach(() => {
          storage.clear();
          expect(storage.length()).toBe(0);
        });

        it('a boolean primitive', () => {
          storage.set('enabled', true);
          const schema = z.boolean();
          const result = storage.get('enabled', false, schema);
          expect(result).toBe(true);
        });

        it('a boolean primitive fallback', () => {
          storage.set('enabled', 'not-a-boolean');
          const schema = z.boolean();
          const result = storage.get('enabled', false, schema);
          expect(result).toBe(false);
        });

        it('a boolean array', () => {
          storage.set('flags', [true, false, true]);
          const schema = z.array(z.boolean());
          const result = storage.get('flags', [false], schema);
          expect(result).toEqual([true, false, true]);
        });

        it('a boolean array fallback', () => {
          storage.set('flags', [true, 'invalid', false]);
          const schema = z.array(z.boolean());
          const result = storage.get('flags', [false], schema);
          expect(result).toEqual([false]);
        });
      });
    });
  });
});
