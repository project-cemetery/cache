import * as os from 'os'
import * as fse from 'fs-extra'
import * as md5 from 'md5'
import { join } from 'path'

import { CacheProvider } from './CacheProvider'
import { Serializer } from './serializer/Serializer'
import { defaultSerializer } from './serializer/defaultSerializer'

interface Config {
  baseDir?: string
  serializer?: Serializer
}

export class FileSystemProvider implements CacheProvider {
  private readonly baseDir: string
  private readonly serializer: Serializer

  constructor(config?: Config) {
    if (config && config.baseDir) {
      this.baseDir = config.baseDir
    } else {
      this.baseDir = os.tmpdir()
    }

    if (config && config.serializer) {
      this.serializer = this.serializer
    } else {
      this.serializer = defaultSerializer
    }
  }

  get = async <T>(key: string, def?: T) => {
    const filePath = this.getFilepath(key)

    const fileExist: boolean = await fse.exists(filePath)

    if (!fileExist) {
      return def
    }

    const content: string = await fse
      .readFile(filePath)
      .then((buffer: Buffer) => buffer.toString())

    if (!content) {
      return def
    }

    try {
      return this.serializer.deserialize<T>(content)
    } catch (e) {
      return def
    }
  }

  set = async <T>(key: string, value: T) => {
    const filePath = this.getFilepath(key)

    const content = await this.serializer.serialize(value)

    await fse.outputFile(filePath, content)
  }

  reset = async (key: string) => {
    const filePath = this.getFilepath(key)

    await fse.remove(filePath)
  }

  private getFilepath = (key: string) => {
    const filename = md5(key)
    const filepath = join(this.baseDir, filename)

    return filepath
  }
}
