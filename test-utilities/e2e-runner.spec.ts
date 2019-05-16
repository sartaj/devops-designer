/* 
  NOTE: This script only runs if process.env.NODE_ENV=== 'e2e'
 */

import {withTempDir} from './withTempDir'

import chalk from 'chalk'

const path = require('path')

const rootDir = path.join(__dirname, '../')

const BASIC_COMPONENTS = [
  'basic-bare-minimum',
  'basic-ignore-files',
  'basic-local-overwrite',
  'basic-compose',
  'problem-bad-path',
  'problem-bad-config',
  'problem-bad-json',
  'problem-no-config'
].reduce(
  (mockComponents, next) => ({
    ...mockComponents,
    [next]: path.join(rootDir, 'domain', 'tests', next, 'module')
  }),
  {}
)

const MOCK_COMPONENTS = {
  ...BASIC_COMPONENTS
}

function logTitle(title) {
  console.log(chalk.bold.blue(title))
}

async function run() {
  const esops = require('../library').default
  const esopsCli = require('../library/interfaces/cli').default

  logTitle('basic-bare-minimum')
  await withTempDir(
    __dirname,
    MOCK_COMPONENTS['basic-bare-minimum'],
    async root => {
      await esops({root})
    }
  )

  logTitle('basic-ignore-files')
  await withTempDir(
    __dirname,
    MOCK_COMPONENTS['basic-ignore-files'],
    async root => {
      await esops({root})
    }
  )

  logTitle('esops-typescript-open-source-module')
  await withTempDir(
    __dirname,
    MOCK_COMPONENTS['esops-typescript-open-source-module'],
    async root => {
      await esops({root})
    }
  )

  logTitle('problem-bad-path')
  await withTempDir(
    __dirname,
    MOCK_COMPONENTS['problem-bad-path'],
    async root => {
      await esops({root})
    }
  )

  logTitle('problem-bad-config')
  await withTempDir(
    __dirname,
    MOCK_COMPONENTS['problem-bad-config'],
    async root => {
      await esops({root})
    }
  )

  logTitle('problem-no-config')
  await withTempDir(
    __dirname,
    MOCK_COMPONENTS['problem-no-config'],
    async root => {
      await esops({root})
    }
  )

  logTitle('basic-local-overwrite yes')
  await withTempDir(
    __dirname,
    MOCK_COMPONENTS['basic-local-overwrite'],
    async root => {
      await esops({root, prompts: [true]})
    }
  )

  logTitle('basic-local-overwrite no')
  await withTempDir(
    __dirname,
    MOCK_COMPONENTS['basic-local-overwrite'],
    async root => {
      await esops({root, prompts: [false]})
    }
  )

  logTitle('basic-overwrite-cwd-file cancel')
  await withTempDir(
    __dirname,
    MOCK_COMPONENTS['basic-local-overwrite'],
    async root => {
      await esops({root, prompts: [new Error('exit')]})
    }
  )

  logTitle('cli clean')
  await withTempDir(__dirname, [], async cwd => {
    await esopsCli(['clean'])
  })

  logTitle('cli help')
  await withTempDir(__dirname, [], async cwd => {
    await esopsCli(['help'])
  })
}

process.env.NODE_ENV === 'e2e' && run()
