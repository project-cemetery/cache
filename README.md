# @solid-soda/cache

It provides features covering simple to advanced caching needs. It is designed for performance and resiliency, ships with ready to use providers for the most common caching backends.

## Installation

`yarn add @solid-soda/cache`

## TL;DR

In example app we want to [redis](https://redis.io/) as cache-backend. Just create a simple cache instance:

```js
import { Cache, RedisProvider } from '@solid-soda/cache'

const provider = new RedisProvider({
  host: 'localhost',
  port: 6379,
  password: 'password',
})

export const cache = new Cache(provider)
```

That is all. We can use `cache` in any place of our application, or pass the result to DI container, etc.

```js
import { cache } from './cache'

// ...
let item = await cache.get('my-key')
if (!item) {
  // cache for key "my-key" not found

  item = doHardWork()
  await cache.set('my-key', item)
}
```

## Providers

You can use many cache providers in your application.

### InMemoryProvider

1. Cache resets after every restart application.
2. Cache can't be shared between application instances.
3. Cache can store any value (e.g. Promises), because it doesn't serialize it.

```js
import { Cache, InMemoryProvider } from '@solid-soda/cache'

const provider = new InMemoryProvider()
export const cache = new Cache(provider)
```

### Redis provider

1. Cache can be stored after restart application, configure [redis persistence](https://redis.io/topics/persistence).
2. Cache can be shared between any kind of applications.
3. Cache can store only serializable value.

```js
import { Cache, RedisProvider } from '@solid-soda/cache'

const provider = new RedisProvider({
  host: 'localhost',
  port: 6379,
  password: 'password',
})
export const cache = new Cache(provider)
```

If you want to use custom serializer, just pass it as second argument to `RedisProvider` constructor. [More about serializers.](#serializer)

```js
import { Cache, RedisProvider } from '@solid-soda/cache'

const provider = new RedisProvider(credentials, serializer)
export const cache = new Cache(provider)
```

### FileSystemProvider

1. Cache can be stored after restart application, it's just files on your disk.
2. Cache can't be shared between any kind of applications, because it's just files on your disk.
3. Cache can store only serializable value.

```js
import { Cache, FileSystemProvider } from '@solid-soda/cache'

const provider = new FileSystemProvider({
  baseDir: __dirname,
})
export const cache = new Cache(provider)
```

If you don't pass `baseDir` it will be use `os.tmpdir`.

If you want to use custom serializer, just pass it to config in `FileSystemProvider` constructor. [More about serializers.](#serializer)

```js
import { Cache, FileSystemProvider } from '@solid-soda/cache'

const provider = new FileSystemProvider({ baseDir: __dirname, serializer })
export const cache = new Cache(provider)
```

### Custom provider

This library can includes only limited number of providers, but you can create custom provider and use it for cache. Just implement `CacheProvider` intreface.

```ts
interface CacheProvider {
  get<T>(key: string, def?: T): Promise<T | undefined>
  set<T>(key: string, value: T): Promise<void>
  reset(key: string): Promise<void>
}
```

For example, we can create `CustomMemoryProvider`:

```ts
import { CacheProvider } from '@solid-soda/cache'

export class CustomMemoryProvider implements CacheProvider {
  private readonly cache = {}

  get = async (key, def) => this.cache[key] || def

  set = async (key, value) => {
    this.cache[key] = value
  }

  reset = async (key) => {
    this.cache[key] = undefined
  }
}
```

Brilliant! Create the provider instance and pass in to `Cache`.

## Serializer

If can provider stores only string value, you can pass `serializer` to it. If you don't, provider will use default serializer based on `JSON.parse` and `JSON.stringify`.

Any serizliser must implements `Serializer` interface:
```ts
interface Serializer {
  serialize<T>(value: T): Promise<string>
  deserialize<T>(value: string): Promise<T>
}
```

Custom serializer example:
```ts
import { Serializer } from '@solid-soda/cache'

const fastSerizliser: Serializer = {
  async serialize(value) {
    const str = // do something
    return str
  },
  async deserialize(str) {
    const value = // do something
    return value
  },
}
```

## Cache invalidation

### Expiration

`Cache#set` method has third argument `lifetime` (amount of mimilliseconds). You can pass it, and after this time cached item will be invalidate.

It's a very simple mechanism:
```ts
import { Cache, InMemoryProvider } from '@solid-soda/cache'

const provider = new InMemoryProvider()
const cache = new Cache(provider)

// ...

async function doDeal() {
  await cache.set('key', 'cached!', 1000)

  await sleep(600)

  const value1 = await cache.get('key') // 'cached!'

  await sleep(600)

  const value2 = await cache.get('key') // null
}
```

### Tag invalidation

Will be released in 1.1.0

## TypeScript decorator

Will be released in 1.1.0
