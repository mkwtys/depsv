import path from 'path'
import stripAnsi from 'strip-ansi'
import { createDeps, depsToString } from '../showDeps'

it('createDeps', async () => {
  const deps = await createDeps({
    cwd: path.resolve(__dirname, 'fixtures'),
  })
  expect(deps).toMatchSnapshot()
  const depsString = await depsToString(deps)
  expect(depsString).toMatchSnapshot()
  expect(stripAnsi(depsString)).toMatchSnapshot()
})
