import * as path from 'path'

import esops from '../../../index'
import {
  getFileContents,
  getSortedFilePaths
} from '../../../test-utilities/fs-utils'
import {withSnapshots} from '../../../test-utilities/withSnapshots'
import {withTempDir} from '../../../test-utilities/withTempDir'

const describe = withSnapshots(__filename)

const rootPath = path.join(__dirname, './module')

describe('esops basics compose capabilities', async assert => {
  await withTempDir(__dirname, rootPath, async root => {
    await esops({
      root: path.join(root, 'infrastructure'),
      logLevel: 'error',
      prompts: [true]
    })

    await assert({
      given: 'different destination in root esops config',
      should: 'generate appropriate files',
      snap: getSortedFilePaths(root)
    })

    await assert({
      given: 'different destination in root esops config',
      should: 'merge package.json',
      snap: getFileContents(path.join(root, 'package.json'))
    })

    await assert({
      given: 'different destination in root esops config',
      should: 'create proper .gitignore with manifest',
      snap: getFileContents(path.join(root, '.gitignore'))
    })
  })
})