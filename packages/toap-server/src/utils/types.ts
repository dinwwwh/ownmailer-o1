export type Promisable<T> = T | Promise<T>
export type Awaitable<T> = T extends Promise<infer U> ? Awaited<U> : T
export type IsEqual<A, B> = (<G>() => G extends A ? 1 : 2) extends <G>() => G extends B ? 1 : 2
  ? true
  : false
