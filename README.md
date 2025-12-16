# Type Safe Storage

`types-storage` is a lightweight TypeScript library that ensures the desired type is correctly returned every time an item is retrieved from `localStorage` or `sessionStorage`, using **Zod**.

## Features

- **Type Safety**: Built for TypeScript with generic types and Zod schemas.
- **Fallback values**: To make sure a value of the same type is always retrieved.
- **Safe Storage Access** Prevents JSON parsing errors.
- **Namespace**: Avoid key conflicts.
- **Expiration Support**: Store values with a time-to-live or TTL.
- **Simple API**: Friendly user experience.

## Installation

You can install `types-storage` via npm:

```bash
npm install types-storage zod
```

## Ready to use

Create a `TypedStorage` instance. You can use both `localStorage` and `sessionStorage`:

```ts
import { TypedStorage } from 'types-storage';
import * as z from 'zod';

const storage = new TypedStorage(localStorage);
```

Use a namespace to prefix keys and avoid conflicts:

```ts
const storage = new TypedStorage(sessionStorage, 'my-app');
```

Save data to storage using the `setItem` method:

```ts
storage.setItem('theme', 'dark');

// Direct method import.
import { setItem as setToLocalStorage } from 'types-storage';
setToLocalStorage('theme', 'dark');
```

Retrieve data with a fallback value and a Zod schema for type safety:

```ts
const themeSchema = z.enum(['light', 'dark']);
const theme = storage.getItem('theme', 'light', themeSchema);
// Returns 'light' if invalid or not found
```

Store and validate arrays or complex objects:

```ts
storage.setItem('filters', ['desc', 'price']);
const stringArraySchema = z.array(z.string());
const filters = storage.getItem('filters', [], stringArraySchema);
// Returns ['desc', 'price'] or [] if invalid
```

Set values with expiration using TTL (in milliseconds):

```ts
storage.setItemWithExpiration('token', 'xxxx', 3600000); // Expires in 1 hour
const tokenSchema = z.string();
const token = storage.getItem('token', '', tokenSchema);
// Returns '' if expired or invalid
```

## 📜 API Reference

- `getItem<T>(key: string, fallback: T, schema: ZodType<T>): T`: Retrieves a value with type safety using a Zod schema.

- `getStorage(): Storage`: Retrieves the current storage.

- `setItem<T>(key: string, value: T): void`: Stores a value in storage.

- `setItemWithExpiration<T>(key: string, value: T, ttl: number): void`: Stores a value that expires after ttl milliseconds.

- `itemExists(key: string): boolean`: Checks if a key exists.

- `removeItem(key: string): void`: Removes a key from storage.

- `clear(): void`: Clears all stored values.

- `length(): number`: Returns the total number of stored items.

- `getNamespace(): string | undefined`: Gets the current namespace.

- `setNamespace(namespace: string): void`: Sets a new namespace.

- `static isAvailable(): boolean`: Checks if storage is available.

MIT License © 2025
