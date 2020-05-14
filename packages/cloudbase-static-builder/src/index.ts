import path from 'path'
import fs from 'fs-extra'
import { Builder } from '@cloudbase/framework-core'

interface StaticBuilderBuildOptions {
    /**
     * 云接入路径
     */
    path: string
}

interface StaticBuilderOptions {
    /**
     * 项目根目录的绝对路径
     */
    projectPath: string
}

export class StaticBuilder extends Builder {
  constructor(options: StaticBuilderOptions) {
    super({
        type: 'static',
        ...options
    });
  }
  async build(entry: string, options?: StaticBuilderBuildOptions) {
    const fileList = await fs.readdir(entry)
    for (const file of fileList) {
      await fs.copy(path.resolve(entry, file), path.resolve(this.distDir, file))
    }
    return {
      static: [
        {
          src: this.distDir,
          cloudPath: options ? options.path || '/' : '/',
        },
      ],
      routes: [
        {
          path: options ? options.path || '/' : '/',
          targetType: 'static',
          target: options ? options.path || '/' : '/',
        },
      ]
    };
  }
};
