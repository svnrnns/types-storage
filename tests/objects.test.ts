import { describe, beforeEach, it, expect } from 'vitest';
import { TypeSafeStorage } from '../lib/index';
import * as z from 'zod';

describe('Object Storage', () => {
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

        it('a simple object', () => {
          storage.set('user', { id: '123', name: 'Alice' });
          expect(storage.getStorage().getItem('test:user')).toBe('{"id":"123","name":"Alice"}');
        });

        it('a nested object', () => {
          storage.set('profile', { id: '123', details: { age: 30, city: 'Paris' } });
          expect(storage.getStorage().getItem('test:profile')).toBe('{"id":"123","details":{"age":30,"city":"Paris"}}');
        });

        it('an object array', () => {
          storage.set('users', [
            { id: '1', name: 'Alice' },
            { id: '2', name: 'Bob' },
          ]);
          expect(storage.getStorage().getItem('test:users')).toBe(
            '[{"id":"1","name":"Alice"},{"id":"2","name":"Bob"}]'
          );
        });
      });

      describe('get', () => {
        beforeEach(() => {
          storage.clear();
          expect(storage.length()).toBe(0);
        });

        it('a simple object', () => {
          storage.set('user', { id: '123', name: 'Alice' });
          const schema = z.object({ id: z.string(), name: z.string() });
          const result = storage.get('user', { id: 'default', name: 'Unknown' }, schema);
          expect(result).toEqual({ id: '123', name: 'Alice' });
        });

        it('a simple object fallback', () => {
          storage.set('user', { id: '123' });
          const schema = z.object({ id: z.string(), name: z.string() });
          const result = storage.get('user', { id: 'default', name: 'Unknown' }, schema);
          expect(result).toEqual({ id: 'default', name: 'Unknown' });
        });

        it('a nested object', () => {
          storage.set('profile', { id: '123', details: { age: 30, city: 'Paris' } });
          const schema = z.object({
            id: z.string(),
            details: z.object({ age: z.number(), city: z.string() }),
          });
          const result = storage.get('profile', { id: 'default', details: { age: 0, city: 'Unknown' } }, schema);
          expect(result).toEqual({ id: '123', details: { age: 30, city: 'Paris' } });
        });

        it('a nested object fallback', () => {
          storage.set('profile', { id: '123', details: { age: 'invalid' } });
          const schema = z.object({
            id: z.string(),
            details: z.object({ age: z.number(), city: z.string() }),
          });
          const result = storage.get('profile', { id: 'default', details: { age: 0, city: 'Unknown' } }, schema);
          expect(result).toEqual({ id: 'default', details: { age: 0, city: 'Unknown' } });
        });

        it('an object array', () => {
          storage.set('users', [
            { id: '1', name: 'Alice' },
            { id: '2', name: 'Bob' },
          ]);
          const schema = z.array(z.object({ id: z.string(), name: z.string() }));
          const result = storage.get('users', [{ id: 'default', name: 'Unknown' }], schema);
          expect(result).toEqual([
            { id: '1', name: 'Alice' },
            { id: '2', name: 'Bob' },
          ]);
        });

        it('an object array fallback', () => {
          storage.set('users', [{ id: '1', name: 'Alice' }, { id: '2' }]);
          const schema = z.array(z.object({ id: z.string(), name: z.string() }));
          const result = storage.get('users', [{ id: 'default', name: 'Unknown' }], schema);
          expect(result).toEqual([{ id: 'default', name: 'Unknown' }]);
        });
      });
    });
  });
});
