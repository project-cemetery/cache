export interface CacheProvider {
  get<T>(key: string, def?: T): Promise<T | undefined>
  set<T>(key: string, value: T, lifetime?: number): Promise<void>
  reset(key: string): Promise<void>
}
