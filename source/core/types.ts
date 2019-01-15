/**
 * ## Primitives
 */

export type ParsedPath = {
  path: string
  toggles: {
    'git-include': string[]
    'npm-include': string[]
    template: string[]
    merge: string[]
  }
  files: string[]
  props: object[]
  stack: ParsedPath[]
}

export type Path = string
export type URL = Path
export type TemplateProps = {}
export type CWD = Path

export type TemporaryTemplatePath = Path
export type TempGenerationPath = Path

export type NetworkUrl = URL
export type NetworkWithProps = [NetworkUrl, TemplateProps]
export type NetworkOption = NetworkUrl | NetworkWithProps
export type NetworkOptions = NetworkOption[] | NetworkUrl
export type NetworkParams = {
  cwd: CWD
  opts: NetworkOptions
}

export type LocalPath = Path
export type LocalWithProps = [LocalPath, TemplateProps]
export type LocalStack = LocalPath | LocalWithProps
export type LocalStacks = LocalStack[] | LocalPath
export type LocalStacksWithProps = LocalWithProps[]
export type LocalParams = {
  cwd: CWD
  opts: LocalStacks
}

export type TemplatePath = LocalPath | TemporaryTemplatePath | NetworkUrl
export type PathList = TemplatePath[]
export type WithProps = LocalWithProps | NetworkWithProps
export type OptionsWithProps = WithProps[]
export type Option = Path | [Path, TemplateProps]
export type Options = Path | Option[]
export type Params = LocalParams | NetworkParams

/**
 * ## Resolve (Network + FS)
 */
export type ParsedStack = {
  cwd: CWD
  opts?: Options

  context?: Option
  toggles?: Toggles
  files?: PathList
  stack?: Options
}

export type Config = {
  cwd: CWD
}
export type Resolve = (
  opts: Options,
  config: Config
) => Promise<LocalStacksWithProps>

export type convertNetworkPathsToLocalPath = (
  options: Options
) => Promise<LocalStacks>

export interface Resolver {
  default: Resolve
  // recursiveStackResolver: (stackManifest: any) => any
}

/**
 * ## Parse
 */
export type ParserOptions = {
  cwd: CWD
  opts: LocalStacksWithProps
}

export type Parser = (options: ParserOptions) => Promise<GeneratorManifest>

export type ConvertPathsToCopyManifest = (paths: Path[]) => GeneratorManifest

export type Toggles = {
  // merge: string[]
}

// export type PatchWhitelist = [
//   ['.json.template', 'RENDER_THEN_MERGE_JSON'],
//   ['.json', 'MERGE_JSON'],
//   ['.gitignore', 'MERGE_FILE'],
//   ['.gitignore.template', 'RENDER_THEN_MERGE_FILE'],
//   ['.npmignore', 'MERGE_FILE'],
//   ['.npmignore.template', 'RENDER_THEN_MERGE_FILE'],
//   ['.md', 'RENDER_THEN_MERGE_FILE']
//   ['.template', 'RENDER_TEMPLATE'],
//   ['', 'COPY_AND_OVERRIDE']
// ]

export type EsopsConfigFile =
  | 'package.json'
  | 'esops.json'
  | '.esops-git-save'
  | '.esops-npm-save'
  | '.esops-merge'
  | '.esops-stack-config'
  | '.esops-overwrite'

export type Methods =
  | 'RENDER_THEN_MERGE_JSON'
  | 'MERGE_JSON'
  | 'MERGE_FILE'
  | 'RENDER_THEN_MERGE_FILE'

export type Copies = {
  cwd: Path
  stackPath: TemplatePath
  relativePath: Path
  fromPath
  toFolder: Path
  toPath: Path
  opts: LocalStacks
  fileExists: boolean
  willTemplate: boolean
  willMerge: boolean
  willGitSave: boolean
  willNPMSave: boolean
}
export type GeneratorManifest = Copies[]

export interface Parsers {
  default: Parser
  convertPathsToCopyManifest: ConvertPathsToCopyManifest
}

/**
 * ## Generate
 */
export type Generate = (manifest: GeneratorManifest) => Promise<boolean>

export type GenerateTemporaryFiles = (
  copyManifest: GeneratorManifest
) => Promise<TempGenerationPath>

export type ForceCopyFiles = (
  TempGenerationPath,
  DestinationPath
) => Promise<boolean>

export interface Generator {
  default: Generate
  generateTmp: GenerateTemporaryFiles
  forceCopy: ForceCopyFiles
}

/**
 * ## Run
 */

type RunOpts = {cwd: CWD; opts?: Options}
export type Run = (opts: RunOpts) => Promise<void>
