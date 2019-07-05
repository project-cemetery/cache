import { addMilliseconds } from 'date-fns'
import { Meta } from '../Meta'

export const createMeta = (lifetime?: number): Meta => {
  const expireAt = lifetime
    ? addMilliseconds(new Date(), lifetime).valueOf()
    : null

  return { expireAt }
}
