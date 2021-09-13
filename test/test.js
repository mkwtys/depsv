import path from 'node:path'
import stripAnsi from 'strip-ansi'
import { fileURLToPath } from 'node:url'
import { createDeps, depsToString } from '../lib/index.js'

it('createDeps', async () => {
  const deps = await createDeps({
    cwd: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'fixtures'),
  })
  expect(deps.dependencies).toBeTruthy()
  expect(deps.devDependencies).toBeTruthy()
  expect(deps.peerDependencies).toBeTruthy()
  expect(deps.optionalDependencies).toBeTruthy()
  expect(deps.bundleDependencies).toBeTruthy()
  expect(deps.bundledDependencies).toBeTruthy()
})

it('depsToString', async () => {
  const deps = {
    dependencies: {
      yargs: {
        homepage: 'https://yargs.js.org/',
        npm: 'https://www.npmjs.com/package/yargs',
        repository: 'https://github.com/yargs/yargs',
        version: '17.0.1'
      },
      'read-pkg': {
        homepage: 'https://github.com/sindresorhus/read-pkg',
        npm: 'https://www.npmjs.com/package/read-pkg',
        repository: 'https://github.com/sindresorhus/read-pkg',
        version: '6.0.0'
      },
      'path-exists': {
        homepage: 'https://github.com/sindresorhus/path-exists',
        npm: 'https://www.npmjs.com/package/path-exists',
        repository: 'https://github.com/sindresorhus/path-exists',
        version: '4.0.0'
      },
      'package-json': {
        homepage: 'https://github.com/sindresorhus/package-json',
        npm: 'https://www.npmjs.com/package/package-json',
        repository: 'https://github.com/sindresorhus/package-json',
        version: '7.0.0'
      },
      'core-js': {
        homepage: 'https://github.com/zloirock/core-js',
        npm: 'https://www.npmjs.com/package/core-js',
        repository: 'https://github.com/zloirock/core-js',
        version: '3.15.2'
      },
      chalk: {
        homepage: 'https://github.com/chalk/chalk',
        npm: 'https://www.npmjs.com/package/chalk',
        repository: 'https://github.com/chalk/chalk',
        version: '4.1.1'
      }
    },
    devDependencies: {
      typescript: {
        homepage: 'https://www.typescriptlang.org/',
        npm: 'https://www.npmjs.com/package/typescript',
        repository: 'https://github.com/Microsoft/TypeScript',
        version: '4.3.5'
      },
      'strip-ansi': {
        homepage: 'https://github.com/chalk/strip-ansi',
        npm: 'https://www.npmjs.com/package/strip-ansi',
        repository: 'https://github.com/chalk/strip-ansi',
        version: '7.0.0'
      },
      rimraf: {
        homepage: 'https://github.com/isaacs/rimraf',
        npm: 'https://www.npmjs.com/package/rimraf',
        repository: 'https://github.com/isaacs/rimraf',
        version: '3.0.2'
      },
      'npm-run-all': {
        homepage: 'https://github.com/mysticatea/npm-run-all',
        npm: 'https://www.npmjs.com/package/npm-run-all',
        repository: 'https://github.com/mysticatea/npm-run-all',
        version: '4.1.5'
      },
      jest: {
        homepage: 'https://jestjs.io/',
        npm: 'https://www.npmjs.com/package/jest',
        repository: 'https://github.com/facebook/jest',
        version: '27.0.6'
      },
      '@types/node': {
        homepage: 'https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node',
        npm: 'https://www.npmjs.com/package/@types/node',
        repository: 'https://github.com/DefinitelyTyped/DefinitelyTyped',
        version: '16.3.2'
      },
      '@types/jest': {
        homepage: 'https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/jest',
        npm: 'https://www.npmjs.com/package/@types/jest',
        repository: 'https://github.com/DefinitelyTyped/DefinitelyTyped',
        version: '26.0.24'
      },
      '@babel/preset-typescript': {
        homepage: 'https://babel.dev/docs/en/next/babel-preset-typescript',
        npm: 'https://www.npmjs.com/package/@babel/preset-typescript',
        repository: 'https://github.com/babel/babel',
        version: '7.14.5'
      },
      '@babel/preset-env': {
        homepage: 'https://babel.dev/docs/en/next/babel-preset-env',
        npm: 'https://www.npmjs.com/package/@babel/preset-env',
        repository: 'https://github.com/babel/babel',
        version: '7.14.7'
      },
      '@babel/cli': {
        homepage: 'https://babel.dev/docs/en/next/babel-cli',
        npm: 'https://www.npmjs.com/package/@babel/cli',
        repository: 'https://github.com/babel/babel',
        version: '7.14.5'
      }
    },
    peerDependencies: {},
    optionalDependencies: {},
    bundleDependencies: {},
    bundledDependencies: {}
  }
  expect(deps).toMatchSnapshot()
  const depsString = await depsToString(deps)
  expect(stripAnsi(depsString)).toMatchSnapshot()
})
