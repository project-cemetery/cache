import { CacheProvider } from './provider/CacheProvider'

export class Cache implements CacheProvider {
  constructor(private readonly provider: CacheProvider) {}

  get = this.provider.get.bind(this.provider)
  set = this.provider.set.bind(this.provider)
  reset = this.provider.reset.bind(this.provider)
}
