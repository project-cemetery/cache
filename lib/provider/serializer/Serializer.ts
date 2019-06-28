export interface Serializer {
  serialize<T>(value: T): Promise<string>
  deserialize<T>(value: string): Promise<T>
}
