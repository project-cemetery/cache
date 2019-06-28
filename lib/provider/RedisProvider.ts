import { createClient } from 'then-redis'

import { CacheProvider } from './CacheProvider'
import { Serializer } from './serializer/Serializer'
import { defaultSerializer } from './serializer/defaultSerializer'

interface Credentials {
  host: string
  port: number
  password?: string
}

export class RedisProvider implements CacheProvider {
  private readonly redisClient: any

  constructor(
    credentials: Credentials,
    private readonly serializer: Serializer = defaultSerializer,
  ) {
    this.redisClient = createClient(credentials)
  }

  get = async <T>(key: string, def?: T) => {
    const value: string | undefined = await this.redisClient.get(key)

    if (!value) {
      return def
    }

    try {
      return this.serializer.deserialize<T>(value)
    } catch (e) {
      return def
    }
  }

  set = async <T>(key: string, value: T) => {
    const strValue = await this.serializer.serialize(value)
    await this.redisClient.set(key, strValue)
  }

  reset = async (key: string) => {
    await this.set(key, undefined)
  }
}
