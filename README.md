# @svnrnns/typed-storage

A lightweight TypeScript library for managing `localStorage` and `sessionStorage` with type safety and optional **Zod** validation.

## Features

- **Type Safety**: Built for TypeScript with generic types
- **Optional Zod Validation**: Add schema validation when you need it
- **Fallback Values**: Ensure a value of the expected type is always retrieved
- **Safe Storage Access**: Handles JSON parsing errors gracefully
- **Namespace Support**: Avoid key conflicts with prefixed keys
- **Expiration Support**: Store values with a time-to-live (TTL)

## Installation

```bash
npm install @svnrnns/typed-storage zod
```

## Quick Start

### Basic Usage

Create a `TypedStorage` instance with `localStorage` or `sessionStorage`:

```ts
import { TypedStorage } from '@svnrnns/typed-storage';

const storage = new TypedStorage(localStorage);

// Set a value
storage.setItem('theme', 'dark');
storage.setItem('user', { id: 1, name: 'John' });

// Get a value (returns null if not found)
const theme = storage.getItem('theme'); // 'dark' | null
const user = storage.getItem<{ id: number; name: string }>('user');

// Get with fallback (returns fallback if not found)
const locale = storage.getItem('locale', 'en'); // 'en' if not found

// Remove a value
storage.removeItem('theme');

// Clear all values
storage.clear();

// Check if key exists
storage.itemExists('theme'); // boolean

// Get storage length
storage.length(); // number
```

### With Namespace

Use a namespace to prefix keys and avoid conflicts:

```ts
import { TypedStorage } from '@svnrnns/typed-storage';

const storage = new TypedStorage(localStorage, 'my-app');

storage.setItem('theme', 'dark');
// Stored as 'my-app:theme' in localStorage
```

### With Zod Validation

Add a Zod schema as the third parameter for type-safe validation:

```ts
import { TypedStorage } from '@svnrnns/typed-storage';
import { z } from 'zod';

const storage = new TypedStorage(localStorage);

// Get with Zod validation (returns fallback if not found or invalid)
const themeSchema = z.enum(['light', 'dark']);
const theme = storage.getItem('theme', 'light', themeSchema);
// Returns 'light' if key 'theme' is not found or fails validation
```

### With Expiration

Set values with a time-to-live (TTL) in milliseconds:

```ts
import { TypedStorage } from '@svnrnns/typed-storage';

const storage = new TypedStorage(localStorage);

// Expires in 1 hour
storage.setItemWithExpiration('token', 'xxxx', 3600000);
```

### Standalone Functions

You can also import standalone functions (uses `localStorage` by default):

```ts
import { getItem, setItem, setItemWithExpiration, itemExists, removeItem, clear, length } from '@svnrnns/typed-storage';
```

## Examples

Store arrays or complex objects with Zod validation:

```ts
import { TypedStorage } from '@svnrnns/typed-storage';
import { z } from 'zod';

const storage = new TypedStorage(localStorage);

storage.setItem('filters', ['desc', 'price']);

const schema = z.array(z.string());
const filters = storage.getItem('filters', [], schema);
// Returns ['desc', 'price'] or [] if invalid
```

## API Reference

### TypedStorage

| Method                  | Signature                                                     | Description                                   |
| ----------------------- | ------------------------------------------------------------- | --------------------------------------------- |
| `setItem`               | `setItem<T>(key: string, value: T): void`                     | Stores a value in storage.                    |
| `setItemWithExpiration` | `setItemWithExpiration<T>(key: string, value: T, ttl): void`  | Stores a value that expires after `ttl` ms.   |
| `getItem`               | `getItem<T>(key: string): T \| null`                          | Retrieves a value. Returns null if not found. |
| `getItem`               | `getItem<T>(key: string, fallback: T): T`                     | Retrieves a value with fallback.              |
| `getItem`               | `getItem<T>(key: string, fallback: T, schema: ZodType<T>): T` | Retrieves a value with Zod validation.        |
| `removeItem`            | `removeItem(key: string): void`                               | Removes a key from storage.                   |
| `clear`                 | `clear(): void`                                               | Clears all stored values.                     |
| `itemExists`            | `itemExists(key: string): boolean`                            | Checks if a key exists.                       |
| `length`                | `length(): number`                                            | Returns the total number of stored items.     |
| `getStorage`            | `getStorage(): globalThis.Storage`                            | Returns the underlying storage instance.      |
| `getNamespace`          | `getNamespace(): string \| undefined`                         | Gets the current namespace.                   |
| `setNamespace`          | `setNamespace(namespace: string): void`                       | Sets a new namespace.                         |
| `static isAvailable`    | `isAvailable(): boolean`                                      | Checks if storage is available.               |

MIT License © 2025
