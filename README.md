# Type Safe Storage

`types-storage` is a small TypeScript library that ensures the desired type is correctly returned every time an item is retrieved from storage.

## ✨ Features

- **Type Safety**: Built for TypeScript.
- **Fallback values**: To make sure a value of the same type is always retrieved.
- **Safe Storage Access** Prevents JSON parsing errors.
- **Namespace**: Avoid key conflicts.
- **Expiration Support**: Store values with a time-to-live or TTL.
- **Simple API**: Friendly user experience.

## 📦 Installation

You can install `types-storage` via npm:

```bash
npm install types-storage
```

## 🚀 Ready to use

Create a `TypeSafeStorage` instance. You can use both `localStorage` and `sessionStorage`;

```ts
import { TypeSafeStorage } from 'types-storage';

const storage = new TypeSafeStorage(localStorage);
```

Pass an string as the second parameter to use namespaces.

```ts
const storage = new TypeSafeStorage(sessionStorage, 'my-app');
```

To save data to storage, simply use the set function and pass the value.

```ts
storage.set('theme', 'dark');

// You can also directly import methods to avoid creating instances.
import { set } from 'types-storage';
set('theme', 'dark');
```

To retrieve data, we must declare the desired Type and provide a fallback value in case the value does not exist or does not match the Type.

```ts
const theme = storage.get<string>('theme', 'light');
const lastLogin = storage.get<Date>('lastLogin', Date.now());

// Using a validator for deep validation
const stringArrayValidator = (value: any): boolean => {
  return Array.isArray(value) && value.every((v) => typeof v === 'string');
};

storage.set('filters', ['desc', 'price']);
const filters = storage.get<string[]>('filters', [], stringArrayValidator); // Expected output: ['desc', 'price'], would return [] if the array did not pass the validator
```

## 📜 API Reference

- `set<T>(key: string, value: T): void`: Stores a value in localStorage.

- `get<T>(key: string, fallback: T, validator?: (value: any) => boolean): T | null`: Retrieves a stored value with an optional validator function.
- `setWithExpiration<T>(key: string, value: T, ttl: number): void`: Stores a value that expires after ttl milliseconds.

- `exists(key: string): boolean`: Checks if a key exists.

- `remove(key: string): void`: Removes a key from storage.

- `clear(): void`: Clears all stored values.

- `length(): number`Returns the total number of stored items.

MIT License © 2025
