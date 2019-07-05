import { Meta } from '../Meta'

export const valueExpired = (meta: Meta): boolean => {
  if (typeof meta.expireAt !== 'number') {
    return false
  }

  return meta.expireAt < new Date().valueOf()
}
