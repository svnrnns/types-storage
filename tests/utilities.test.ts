import { describe, beforeEach, it, expect, vi } from 'vitest';
import { TypedStorage } from '../lib/index';
import * as z from 'zod';

describe('Utility Storage', () => {
  const localStorageInstance = new TypedStorage(localStorage, 'test');
  const sessionStorageInstance = new TypedStorage(sessionStorage, 'test');

  [localStorageInstance, sessionStorageInstance].forEach((storage, index) => {
    const storageType = index === 0 ? 'localStorage' : 'sessionStorage';

    describe(`${storageType}`, () => {
      beforeEach(() => {
        storage.clear();
        storage.setNamespace('test');
        expect(storage.length()).toBe(0);
      });

      it('returns fallback if key does not exist', () => {
        const schema = z.string();
        const result = storage.getItem('nonexistent', 'default', schema);
        expect(result).toBe('default');
      });

      it('returns fallback for malformed JSON', () => {
        const schema = z.object({});
        const result = storage.getItem('data', {}, schema);
        expect(result).toEqual({});
      });

      it('checks if storage is available', () => {
        expect(TypedStorage.isAvailable()).toBe(true);
      });

      it('handles namespacing', () => {
        storage.setItem('key', 'value');
        expect(storage.getStorage().getItem('test:key')).toBe('value');
        storage.setNamespace('new');
        storage.setItem('key', 'new-value');
        expect(storage.getStorage().getItem('new:key')).toBe('new-value');
        expect(storage.getNamespace()).toBe('new');
      });

      it('clears all keys', () => {
        storage.setItem('key1', 'value1');
        storage.setItem('key2', 'value2');
        expect(storage.length()).toBe(2);
        storage.clear();
        expect(storage.length()).toBe(0);
      });

      it('checks key existence', () => {
        expect(storage.itemExists('key')).toBe(false);
        storage.setItem('key', 'value');
        expect(storage.itemExists('key')).toBe(true);
      });

      it('gets storage length', () => {
        expect(storage.length()).toBe(0);
        storage.setItem('key1', 'value1');
        storage.setItem('key2', 'value2');
        expect(storage.length()).toBe(2);
      });

      it('sets with expiration', async () => {
        vi.useFakeTimers();
        storage.setItemWithExpiration('temp', 'value', 1000);
        const schema = z.string();
        expect(storage.getItem('temp', 'default', schema)).toBe('value');
        vi.advanceTimersByTime(1000);
        expect(storage.getItem('temp', 'default', schema)).toBe('default');
        vi.useRealTimers();
      });
    });
  });
});
