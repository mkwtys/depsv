declare type Dependency = {
  [pkgName: string]: {
    homepage: string
    npm: string
    repository: string
    version: string
  }
}

declare type Dependencies = {
  dependencies?: Dependency
  devDependencies?: Dependency
  peerDependencies?: Dependency
  optionalDependencies?: Dependency
  bundleDependencies?: Dependency
  bundledDependencies?: Dependency
}

export declare function createDeps({ cwd }: { cwd: string }): Promise<Dependencies>

export declare function depsToString(deps: Dependencies): string

export declare function showDeps(options?: { cwd?: string }): Promise<void>

