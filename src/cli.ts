#!/usr/bin/env node

import yargs from 'yargs'
import { showDeps } from './index.js'

export async function run() {
  yargs(process.argv.slice(2)).usage(`Usage:\n  $ depsv`).locale('en').help().alias({
    h: 'help',
    v: 'version',
  })

  await showDeps()
}
