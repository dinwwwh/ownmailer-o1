import { contract } from '@toap/contract'
import { InferOutput, object, string } from 'valibot'
import { expectTypeOf, it } from 'vitest'
import { appRouter, userRouter } from './__tests__/contract'
import { fakeUser } from './__tests__/fakes'
import { ServerBuilder } from './builder'

const builderWithoutContext = new ServerBuilder()
const builderWithMismatchedContext = new ServerBuilder<{ hi: 'hello' }>()

it('strict context on undefined context', () => {
  builderWithoutContext.implement(appRouter.ping).handler(({ context: ctx }) => {
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
    .implement(
      contract({
        method: 'GET' as const,
        path: '/pets/{id}' as const,
        params: ParamsSchema,
        query: QuerySchema,
        body: BodySchema,
        headers: HeadersSchema,
      })
    )
    .handler(({ context, params, headers, query, body }) => {
      expectTypeOf(context).toMatchTypeOf<Context>()
      expectTypeOf(params).toMatchTypeOf<InferOutput<typeof ParamsSchema>>()
      expectTypeOf(headers).toMatchTypeOf<InferOutput<typeof HeadersSchema>>()
      expectTypeOf(query).toMatchTypeOf<InferOutput<typeof QuerySchema>>()
      expectTypeOf(body).toMatchTypeOf<InferOutput<typeof BodySchema>>()
    })
})

it('strict handler response body', () => {
  // @ts-expect-error the return must contain body
  builder.implement(userRouter.find).handler(() => {
    return {
      status: 200,
    }
  })

  builder.implement(userRouter.find).handler(({ context: ctx }) => {
    expectTypeOf(ctx).toMatchTypeOf<Context>()

    return {
      status: 200,
      body: fakeUser,
    }
  })
})

it('strict handler response headers', () => {
  // @ts-expect-error the return must contain headers
  builder.implement(appRouter.ping).handler(({ context: ctx }) => {
    expectTypeOf(ctx).toMatchTypeOf<Context>()

    return {
      status: 200,
    }
  })

  builder.implement(appRouter.ping).handler(({ context: ctx }) => {
    expectTypeOf(ctx).toMatchTypeOf<Context>()

    return {
      status: 200,
      headers: {
        'x-timestamp': new Date().toISOString(),
      },
    }
  })
})

it('only allow combined valid handlers', () => {
  builder.implement(userRouter).router({
    // @ts-expect-error must be a valid handler
    find: builder.implement(userRouter.find),
    create: '' as any,
    update: '' as any,
    delete: '' as any,
  })
})

it('only allow combined handlers that match the context', () => {
  builder.implement(userRouter).router({
    // Below can because it does not depend on any context so it can safely run side this router
    create: builderWithoutContext.implement(userRouter.create).handler((_) => '' as any),
    // @ts-expect-error must match the context
    update: builderWithMismatchedContext.implement(userRouter.update).handler((_) => '' as any),
    delete: '' as any,
    find: '' as any,
  })
})
