import { describe, beforeEach, it, expect } from 'vitest';
import { TypeSafeStorage } from '../lib/index';
import * as z from 'zod';

describe('Number Storage', () => {
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

        it('a positive number', () => {
          storage.set('count', 42);
          expect(storage.getStorage().getItem('test:count')).toBe('42');
        });

        it('a negative number', () => {
          storage.set('offset', -123);
          expect(storage.getStorage().getItem('test:offset')).toBe('-123');
        });

        it('a number array', () => {
          storage.set('scores', [10, 20, 30]);
          expect(storage.getStorage().getItem('test:scores')).toBe('[10,20,30]');
        });
      });

      describe('get', () => {
        beforeEach(() => {
          storage.clear();
          expect(storage.length()).toBe(0);
        });

        it('a number primitive', () => {
          storage.set('count', 42);
          const schema = z.number();
          const result = storage.get('count', 0, schema);
          expect(result).toBe(42);
        });

        it('a number primitive fallback', () => {
          storage.set('count', 'not-a-number');
          const schema = z.number();
          const result = storage.get('count', 0, schema);
          expect(result).toBe(0);
        });

        it('a number array', () => {
          storage.set('scores', [10, 20, 30]);
          const schema = z.array(z.number());
          const result = storage.get('scores', [0], schema);
          expect(result).toEqual([10, 20, 30]);
        });

        it('a number array fallback', () => {
          storage.set('scores', [10, 'invalid', 30]);
          const schema = z.array(z.number());
          const result = storage.get('scores', [0], schema);
          expect(result).toEqual([0]);
        });

        it('a number with constraints', () => {
          storage.set('age', 25);
          const schema = z.number().min(18).max(100);
          const result = storage.get('age', 18, schema);
          expect(result).toBe(25);
        });

        it('a number with constraints fallback', () => {
          storage.set('age', 15);
          const schema = z.number().min(18).max(100);
          const result = storage.get('age', 18, schema);
          expect(result).toBe(18);
        });
      });
    });
  });
});
