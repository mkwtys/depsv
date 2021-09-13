#!/usr/bin/env node

import yargs from 'yargs'
import { showDeps } from '../lib/index.js'

yargs(process.argv.slice(2)).usage(`Usage:\n  $ depsv`).locale('en').help().alias({
  h: 'help',
  v: 'version',
})

await showDeps().catch((err) => {
  console.log(err)
  process.exit(1)
})
