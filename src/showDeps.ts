import { URL } from 'url'
import chalk from 'chalk'
import Module from 'module'
import packageJson from 'package-json'
import path from 'path'
import pathExists from 'path-exists'
import readPkg from 'read-pkg'

type Dependency = {
  [pkgName: string]: {
    homepage: string
    npm: string
    repository: string
    version: string
  }
}

type Dependencies = {
  dependencies?: Dependency
  devDependencies?: Dependency
  peerDependencies?: Dependency
  optionalDependencies?: Dependency
  bundleDependencies?: Dependency
  bundledDependencies?: Dependency
}

function getPackagePath(pkgName: string, options: { cwd?: string }) {
  const cwd = options && options.cwd ? options.cwd : process.cwd()
  // @ts-ignore - Module._nodeModulePaths
  const nodeModulesPaths: string[] = Module._nodeModulePaths(cwd)
  const packagePath = path.join(nodeModulesPaths[0], pkgName)
  if (pathExists.sync(packagePath)) {
    return packagePath
  }
}

export async function createDeps({ cwd }: { cwd: string }): Promise<Dependencies> {
  const pkg = await readPkg({ cwd })

  const createSummary = async (deps): Promise<Dependency> => {
    if (!deps) {
      return {}
    }

    const homepageToString = (home: string) => {
      if (!home) {
        return ''
      }
      const h = new URL(home)
      return `${h.origin}${h.pathname}${h.search}`
    }

    const repositoryToString = (repo: string) => {
      if (!repo) {
        return ''
      }
      const r = new URL(repo)
      return `https://${r.host}${r.pathname.replace('.git', '')}`
    }

    return await Object.keys(deps).reduce(async (prev, value) => {
      const prevValue = await prev
      const pkgPath = getPackagePath(value, { cwd })
      const pkg = pkgPath ? await readPkg({ cwd: pkgPath }) : await packageJson(value)

      return {
        ...{
          [value]: {
            homepage: homepageToString(pkg.homepage),
            npm: `https://www.npmjs.com/package/${pkg.name}`,
            repository: repositoryToString(pkg.repository?.url),
            version: pkg.version,
          },
        },
        ...prevValue,
      }
    }, Promise.resolve({}))
  }

  return {
    dependencies: {
      ...(await createSummary(pkg.dependencies)),
    },
    devDependencies: {
      ...(await createSummary(pkg.devDependencies)),
    },
    peerDependencies: {
      ...(await createSummary(pkg.peerDependencies)),
    },
    optionalDependencies: {
      ...(await createSummary(pkg.optionalDependencies)),
    },
    bundleDependencies: {
      ...(await createSummary(pkg.bundleDependencies)),
    },
    bundledDependencies: {
      ...(await createSummary(pkg.bundledDependencies)),
    },
  }
}

export function depsToString(deps: Dependencies) {
  const INDENT = 2
  const PADDING = 2
  const maxDepsNameLength = Math.max.apply(
    null,
    Object.entries(deps).map(([depsName, dep]) =>
      Math.max.apply(
        null,
        Object.keys(dep).map((pkgName) => pkgName.length)
      )
    )
  )
  const maxVersionLength = Math.max.apply(
    null,
    Object.entries(deps).map(([depsName, dep]) =>
      Math.max.apply(
        null,
        Object.entries(dep).map(([pkgName, pkgSummary]) => pkgSummary.version.length)
      )
    )
  )
  const maxNpmLength = Math.max.apply(
    null,
    Object.entries(deps).map(([depsName, dep]) =>
      Math.max.apply(
        null,
        Object.entries(dep).map(([pkgName, pkgSummary]) => pkgSummary.npm.length)
      )
    )
  )
  const spaceToString = (repeat) => ' '.repeat(repeat)
  const versionIndentToString = (pkgName) => spaceToString(maxDepsNameLength - pkgName.length + PADDING)
  const urlIndentToString = (version) => spaceToString(maxVersionLength - version.length + PADDING)
  const nextUrlLineIndentToString = () =>
    spaceToString(INDENT + maxDepsNameLength + PADDING + maxVersionLength + PADDING)

  return Object.entries(deps)
    .filter(([depsName, dep]) => Object.keys(dep).length)
    .map(
      ([depsName, dep]) =>
        `\n${spaceToString(INDENT)}${chalk.green.bold(depsName)}\n${Object.entries(dep)
          .sort((a, b) => {
            if (a[0] < b[0]) {
              return -1
            }
            if (a[0] > b[0]) {
              return 1
            }
            return 0
          })
          .map(([pkgName, { homepage, repository, version, npm }]) => {
            return `${spaceToString(INDENT)}${pkgName}${versionIndentToString(pkgName)}${chalk.gray(
              version
            )}${urlIndentToString(version)}${chalk.blue.underline(npm)}${spaceToString(
              PADDING + maxNpmLength - npm.length
            )}${
              homepage && homepage !== ''
                ? chalk.blue.underline(homepage)
                : repository && repository !== '' && homepage !== repository
                ? chalk.blue.underline(repository)
                : repository === ''
                ? ''
                : `${spaceToString(INDENT)}${chalk.blue.underline(repository)}`
            }`
          })
          .join('\n')}`
    )
    .join('\n')
}

export async function showDeps(options?: { cwd?: string }) {
  const cwd = options && options.cwd ? options.cwd : process.cwd()
  const deps = await createDeps({ cwd })
  console.log(depsToString(deps))
}
