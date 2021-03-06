#!/usr/bin/env node
import {UserParams} from './../../core/types'
import {cond, pipe} from 'ramda'
import * as path from 'path'

import {CleanGuide, EsopsHowTo} from '../../core/messages'
import {Conditional, defaultTo} from '../../utilities/sync'
import {
  command,
  minimist,
  willAnnounce
} from '../../side-effects/console/components/cli'
import esops from '../../'

const onHelp: Conditional = [command.first('help'), willAnnounce(EsopsHowTo)]

const onClean: Conditional = [command.first('clean'), willAnnounce(CleanGuide)]

const runApp: Conditional = defaultTo(commands => {
  const userRoot = commands._[0]
  const userDestination = commands._[1]
  const cwd = process.cwd()
  const overwrite = commands.o || commands.overwrite
  const logLevel = commands.logLevel
  const prompts = overwrite ? [true] : undefined
  const root = path.resolve(cwd, userRoot || '')
  const destination = userDestination && path.resolve(cwd, userDestination)
  const params: UserParams = {root, destination, prompts, logLevel}
  esops(params)
})

const onCommand = cond([onHelp, onClean, runApp])

type CLI = (argv: string[]) => void
const cli: CLI = pipe(
  minimist,
  onCommand
)

export default cli

const isRunningAsScript = require.main === module
isRunningAsScript && cli(process.argv.slice(2))
