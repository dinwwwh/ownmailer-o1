import { AllowedMethod } from '@toap/contract'
import { expectTypeOf, it } from 'vitest'
import { petContractCollection, userContractCollection } from './__tests__/contract'
import { ServerBuilder } from './builder'
import { router } from './router'

interface Context {
  auth?: {
    id: string
    token: string
  }

  db: 'mysql' | 'postgres'
}

const builder = new ServerBuilder<Context>()

it('require its contracts and resolvers to match', () => {
  router(userContractCollection, builder.fulfill(userContractCollection).collect('' as any))

  // @ts-expect-error mismatched contracts and resolvers
  router(petContractCollection, builder.fulfill(userContractCollection).collect('' as any))
})

it('require correct input', () => {
  const appRouter = router(
    userContractCollection,
    builder.fulfill(userContractCollection).collect('' as any)
  )

  expectTypeOf<Parameters<typeof appRouter>>().toMatchTypeOf<
    [
      {
        method: AllowedMethod
        path: string
        context: Context
        query: unknown
        headers: unknown
        body: unknown
      }
    ]
  >()

  expectTypeOf<ReturnType<typeof appRouter>>().toMatchTypeOf<
    Promise<{
      status: number
      body?: unknown
      headers?: unknown
    }>
  >()
})
