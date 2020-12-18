import { CacheProvider } from './CacheProvider'
import { hashCode } from '../helpers/hashCode'

type ProviderChooser = (
  key: string,
  providers: CacheProvider[],
) => CacheProvider

export class MultipleProvidersProvider implements CacheProvider {
  constructor(
    private readonly providers: Array<CacheProvider>,
    private readonly providerChooser?: ProviderChooser,
  ) {}

  get = async <T>(key: string, def?: T) => {
    const provider = this.defineProviderByKey(key)

    return provider.get(key, def)
  }

  set = async <T>(key: string, value: T) => {
    const provider = this.defineProviderByKey(key)

    await provider.set(key, value)
  }

  reset = async (key: string) => {
    await this.set(key, undefined)
  }

  private defineProviderByKey = (key: string) => {
    const chooser = this.providerChooser || this.defaultChooser

    return chooser(key, this.providers)
  }

  private defaultChooser: ProviderChooser = (key, providers): CacheProvider => {
    const totalRedisCount = providers.length
    const redisNumber = hashCode(key) % totalRedisCount

    return providers[redisNumber] || providers[0]
  }
}
