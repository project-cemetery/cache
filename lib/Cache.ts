import { CacheProvider } from './provider/CacheProvider'

export class Cache implements CacheProvider {
  constructor(private readonly provider: CacheProvider) {}

  get = this.provider.get
  set = this.provider.set
  reset = this.provider.reset
}
