/* eslint no-console: 0 */

import compilerDevelop from './compiler/develop'
import compilerBuild from './compiler/build'

import createDefaultWebpackConfig from './default.webpack'

const defaultOpts = {
  devMode: false,
  cwd: process.cwd(),
  webpackConfig: null,
  port: 8000,
  publicPath: 'http://localhost:8000'
}

// opts expects config to be generated by `../config` file
export default async userOpts => {
  const opts = {
    ...defaultOpts,
    ...userOpts
  }

  const webpackConfig = opts.webpackConfig || createDefaultWebpackConfig(opts)

  // Run server
  if (opts.devMode) return compilerDevelop(webpackConfig, opts)
  else return compilerBuild(webpackConfig)
}
