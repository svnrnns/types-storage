import { describe, beforeEach, it, expect } from 'vitest';
import { TypeSafeStorage } from '../lib/index';
import * as z from 'zod';

describe('String Storage', () => {
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

        it('a literal string', () => {
          storage.set('locale', 'en');
          expect(storage.getStorage().getItem('test:locale')).toBe('en');
        });

        it('a string with special characters', () => {
          storage.set('email', 'hello@world');
          expect(storage.getStorage().getItem('test:email')).toBe('hello@world');
        });

        it('a string array', () => {
          storage.set('locales', ['en', 'es', 'fr']);
          expect(storage.getStorage().getItem('test:locales')).toBe('["en","es","fr"]');
        });
      });

      describe('get', () => {
        beforeEach(() => {
          storage.clear();
          expect(storage.length()).toBe(0);
        });

        it('a string primitive', () => {
          storage.set('text', 'hello');
          const schema = z.string();
          const result = storage.get('text', 'default', schema);
          expect(result).toBe('hello');
        });

        it('a string primitive fallback', () => {
          storage.set('text', 1);
          const schema = z.string();
          const result = storage.get('text', 'default', schema);
          expect(result).toBe('default');
        });

        it('a string array', () => {
          storage.set('locales', ['en', 'es', 'fr']);
          const schema = z.array(z.string());
          const result = storage.get('locales', ['default'], schema);
          expect(result).toEqual(['en', 'es', 'fr']);
        });

        it('a string array fallback', () => {
          storage.set('locales', ['en', 23, 'fr']);
          const schema = z.array(z.string());
          const result = storage.get('locales', ['default'], schema);
          expect(result).toEqual(['default']);
        });

        it('a string enum', () => {
          storage.set('locale', 'en');
          const schema = z.enum(['en', 'es', 'fr']);
          const result = storage.get('locale', 'en', schema);
          expect(result).toBe('en');
        });

        it('a string enum fallback', () => {
          storage.set('locale', 'invalid');
          const schema = z.enum(['en', 'es', 'fr']);
          const result = storage.get('locale', 'en', schema);
          expect(result).toBe('en');
        });
      });
    });
  });
});
