import { contract } from '@toap/contract'
import { InferOutput, object, string } from 'valibot'
import { expectTypeOf, it } from 'vitest'
import { appContractCollection, userContractCollection } from './__tests__/contract'
import { fakeUser } from './__tests__/fakes'
import { ServerBuilder } from './builder'

const builderWithoutContext = new ServerBuilder()
const builderWithMismatchedContext = new ServerBuilder<{ hi: 'hello' }>()

it('strict context on undefined context', () => {
  builderWithoutContext.fulfill(appContractCollection.ping).resolver(({ context: ctx }) => {
    expectTypeOf(ctx).toMatchTypeOf<unknown>()

    return '' as any
  })
})

type Context = {
  userId: string
  db: 'mysql' | 'postgres'
}

const builder = new ServerBuilder<Context>()

it('can infer input', () => {
  const ParamsSchema = object({
    id: string(),
  })

  const QuerySchema = object({
    page: string(),
    limit: string(),
  })

  const BodySchema = object({
    name: string(),
    age: string(),
  })

  const HeadersSchema = object({
    'x-timestamp': string(),
  })

  builder
    .fulfill(
      contract({
        method: 'GET' as const,
        path: '/pets/{id}' as const,
        params: ParamsSchema,
        query: QuerySchema,
        body: BodySchema,
        headers: HeadersSchema,
      })
    )
    .resolver(({ context, params, headers, query, body }) => {
      expectTypeOf(context).toMatchTypeOf<Context>()
      expectTypeOf(params).toMatchTypeOf<InferOutput<typeof ParamsSchema>>()
      expectTypeOf(headers).toMatchTypeOf<InferOutput<typeof HeadersSchema>>()
      expectTypeOf(query).toMatchTypeOf<InferOutput<typeof QuerySchema>>()
      expectTypeOf(body).toMatchTypeOf<InferOutput<typeof BodySchema>>()
    })
})

it('strict resolver response body', () => {
  // @ts-expect-error the return must contain body
  builder.fulfill(userContractCollection.find).resolver(() => {
    return {
      status: 200,
    }
  })

  builder.fulfill(userContractCollection.find).resolver(({ context: ctx }) => {
    expectTypeOf(ctx).toMatchTypeOf<Context>()

    return {
      status: 200,
      body: fakeUser,
    }
  })
})

it('strict resolver response headers', () => {
  // @ts-expect-error the return must contain headers
  builder.fulfill(appContractCollection.ping).resolver(({ context: ctx }) => {
    expectTypeOf(ctx).toMatchTypeOf<Context>()

    return {
      status: 200,
    }
  })

  builder.fulfill(appContractCollection.ping).resolver(({ context: ctx }) => {
    expectTypeOf(ctx).toMatchTypeOf<Context>()

    return {
      status: 200,
      headers: {
        'x-timestamp': new Date().toISOString(),
      },
    }
  })
})

it('only allow combined valid resolvers', () => {
  builder.fulfill(userContractCollection).collect({
    // @ts-expect-error must be a valid resolver
    find: builder.fulfill(userContractCollection.find),
    create: '' as any,
    update: '' as any,
    delete: '' as any,
  })
})

it('only allow combined resolvers that match the context', () => {
  builder.fulfill(userContractCollection).collect({
    // Below can because it does not depend on any context so it can safely run side this collection
    create: builderWithoutContext.fulfill(userContractCollection.create).resolver((_) => '' as any),
    // @ts-expect-error must match the context
    update: builderWithMismatchedContext
      .fulfill(userContractCollection.update)
      .resolver((_) => '' as any),
    delete: '' as any,
    find: '' as any,
  })
})
