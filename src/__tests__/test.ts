import path from 'path'
import stripAnsi from 'strip-ansi'
import { createDeps, depsToString } from '../showDeps'
import { fileURLToPath } from 'url'

it('createDeps', async () => {
  const deps = await createDeps({
    cwd: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'fixtures'),
  })
  expect(deps).toMatchSnapshot()
  const depsString = await depsToString(deps)
  expect(depsString).toMatchSnapshot()
  expect(stripAnsi(depsString)).toMatchSnapshot()
})
