import { hashCode } from '../helpers/hashCode'

describe('hashCode', () => {
  test('should return different numbers for different strings', () => {
    const code1 = hashCode('a')
    const code2 = hashCode('aa')

    expect(code1 === code2).toBeFalsy()
  })

  test('should return same numbers for same strings', () => {
    const code1 = hashCode('a')
    const code2 = hashCode('a')

    expect(code1 === code2).toBeTruthy()
  })
})
