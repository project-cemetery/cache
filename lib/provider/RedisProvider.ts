import { createClient } from 'then-redis'

import { CacheProvider } from './CacheProvider'

export class RedisProvider implements CacheProvider {
  private readonly redisClient: any

  constructor(host: string, port: number, password: string | undefined) {
    this.redisClient = createClient({
      host,
      port,
      password,
    })
  }

  get = async <T>(key: string, def?: T) => {
    const value: string | undefined = await this.redisClient.get(key)

    if (!value) {
      return def
    }

    try {
      return JSON.parse(value) as T
    } catch (e) {
      return def
    }
  }

  set = async <T>(key: string, value: T) => {
    await this.redisClient.set(key, JSON.stringify(value))
  }

  reset = async (key: string) => {
    await this.set(key, undefined)
  }
}
