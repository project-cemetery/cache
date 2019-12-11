import { CacheProvider } from './provider/CacheProvider'
import { createMetaKey } from './helpers/createMetaKey'
import { valueExpired } from './helpers/valueExpired'
import { createMeta } from './helpers/createMeta'
import { Meta } from './Meta'

const DEFAULT_META: Meta = {}

export class Cache implements CacheProvider {
  constructor(private readonly provider: CacheProvider) {}

  async get<T>(key: string, def?: T): Promise<T | undefined> {
    const metaKey = createMetaKey(key)

    const [value, meta] = await Promise.all([
      this.provider.get(key, def),
      this.provider.get(metaKey, DEFAULT_META),
    ])

    if (valueExpired(meta)) {
      // delete expired value and return default value
      await this.reset(key)
      return def
    }

    return value
  }

  async set<T>(key: string, value: T, lifetime?: number): Promise<void> {
    const meta = createMeta(lifetime)
    const metaKey = createMetaKey(key)

    await Promise.all([
      this.provider.set(key, value),
      this.provider.set(metaKey, meta),
    ])
  }

  async reset(key: string): Promise<void> {
    const metaKey = createMetaKey(key)

    await Promise.all([this.provider.reset(key), this.provider.reset(metaKey)])
  }

  async useCache<T>(
    key: string,
  ): Promise<[T | undefined, (v: T) => Promise<void>]> {
    const cached = await this.get<T>(key)

    const setCached = async (value: T) => {
      await this.set(key, value)
    }

    return [cached, setCached]
  }
}
