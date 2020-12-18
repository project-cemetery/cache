import Redis from 'ioredis'
import { ConnectionString } from 'connection-string'

import { CacheProvider } from './CacheProvider'
import { Serializer } from './serializer/Serializer'
import { defaultSerializer } from './serializer/defaultSerializer'

type Config = Redis.RedisOptions | string

export class RedisProvider implements CacheProvider {
  private readonly redisClient: Redis.Redis

  constructor(
    config: Config,
    private readonly serializer: Serializer = defaultSerializer,
  ) {
    if (typeof config === 'string') {
      const parsed = new ConnectionString(config)

      this.redisClient = new Redis({
        port: parsed.port,
        host: parsed.host,
        username: parsed.user,
        password: parsed.password,
      })
    } else {
      this.redisClient = new Redis(config)
    }
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
