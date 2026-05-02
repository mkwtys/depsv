import chalk from 'chalk'
import packageJson from 'package-json'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { readPackage } from 'read-pkg'

function getPackagePath(pkgName, options) {
  const cwd = options && options.cwd ? options.cwd : process.cwd()
  const packagePath = path.join(cwd, 'node_modules', pkgName)
  if (existsSync(packagePath)) {
    return packagePath
  }
}

export async function createDeps({ cwd }) {
  const pkg = await readPackage({ cwd })

  const createSummary = async (deps) => {
    if (!deps) {
      return {}
    }

    const homepageToString = (home) => {
      if (!home) {
        return ''
      }
      const h = new URL(home)
      return `${h.origin}${h.pathname}${h.search}`
    }

    const repositoryToString = (repo) => {
      if (!repo) {
        return ''
      }
      const r = new URL(repo)
      return `https://${r.host}${r.pathname.replace('.git', '')}`
    }

    return await Object.keys(deps).reduce(async (prev, value) => {
      const prevValue = await prev
      const pkgPath = getPackagePath(value, { cwd })
      const pkg = pkgPath ? await readPackage({ cwd: pkgPath }) : await packageJson(value, { fullMetadata: true })

      return {
        ...prevValue,
        [value]: {
          homepage: homepageToString(pkg.homepage),
          npm: `https://www.npmjs.com/package/${pkg.name}`,
          repository: repositoryToString(pkg.repository ? pkg.repository.url : undefined),
          version: pkg.version,
        },
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

export function depsToString(deps) {
  const INDENT = 2
  const PADDING = 2
  const nonEmptyDeps = Object.entries(deps).filter(([, dep]) => Object.keys(dep).length > 0)
  if (nonEmptyDeps.length === 0) {
    return ''
  }
  const maxDepsNameLength = Math.max(
    ...nonEmptyDeps.map(([, dep]) => Math.max(...Object.keys(dep).map((pkgName) => pkgName.length)))
  )
  const maxVersionLength = Math.max(
    ...nonEmptyDeps.map(([, dep]) => Math.max(...Object.entries(dep).map(([, pkgSummary]) => pkgSummary.version.length)))
  )
  const maxNpmLength = Math.max(
    ...nonEmptyDeps.map(([, dep]) => Math.max(...Object.entries(dep).map(([, pkgSummary]) => pkgSummary.npm.length)))
  )
  const spaceToString = (repeat) => ' '.repeat(repeat)
  const versionIndentToString = (pkgName) => spaceToString(maxDepsNameLength - pkgName.length + PADDING)
  const urlIndentToString = (version) => spaceToString(maxVersionLength - version.length + PADDING)

  return nonEmptyDeps
    .map(
      ([depsName, dep]) =>
        `\n${spaceToString(INDENT)}${chalk.green.bold(depsName)}\n${Object.entries(dep)
          .sort((a, b) => a[0].localeCompare(b[0]))
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

export async function showDeps(options) {
  const cwd = options && options.cwd ? options.cwd : process.cwd()
  const deps = await createDeps({ cwd })
  console.log(depsToString(deps))
}
