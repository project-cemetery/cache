function hashCode(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++)
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0

  return h
}

export { hashCode }
