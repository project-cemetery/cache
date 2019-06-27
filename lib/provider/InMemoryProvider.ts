import { CacheProvider } from './CacheProvider'

export class InMemoryProvider implements CacheProvider {
  private readonly cache = {}

  get = async <T>(key: string, def?: T) => (this.cache[key] || def) as T

  set = async <T>(key: string, value: T) => {
    this.cache[key] = value
  }

  reset = async (key: string) => {
    this.cache[key] = undefined
  }
}
