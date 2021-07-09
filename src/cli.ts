#!/usr/bin/env node

import yargs from 'yargs'
import { showDeps } from './'

export async function run() {
  yargs.usage(`Usage:\n  $ depsv`).locale('en').help().alias({
    h: 'help',
    v: 'version',
  }).argv

  await showDeps()
}
