# @solid-soda/cache

It provides features covering simple to advanced caching needs. It is designed for performance and resiliency, ships with ready to use providers for the most common caching backends.

## Installation

`yarn add @solid-soda/cache`


## TL;DR

In example app we want to use `DotEnvConfiguration` in dev environment and `EnvConfiguraton` in production. Just create a simple factory function:

```js
import { Cache, InMemoryProvider } from '@solid-soda/cache'

const provider = new InMemoryProvider()
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

## Basics

DOCS WIP

## Providers

DOCS WIP

## Cache invalidation

Will be released in 1.0.0

## TypeScript decorator

Will be released in 1.0.0
