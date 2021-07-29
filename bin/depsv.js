#!/usr/bin/env node

import { run } from '../lib/cli.js'

run().catch((err) => {
  console.log(err)
  process.exit(1)
})
