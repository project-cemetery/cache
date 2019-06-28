import { Serializer } from './Serializer'

export const defaultSerializer: Serializer = {
  async serialize<T>(value: T) {
    return JSON.stringify(value)
  },
  async deserialize<T>(value: string) {
    return JSON.parse(value) as T
  },
}
