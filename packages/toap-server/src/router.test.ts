import { expect, it } from 'vitest'
import { userContractCollection } from './__tests__/contract'
import { fakeUser } from './__tests__/fakes'
import { ServerBuilder } from './builder'
import { router } from './router'

interface Context {
  auth?: {
    id: string
    token: string
  }

  db: 'mysql' | 'postgres'
}

const context: Context = {
  db: 'mysql',
  auth: {
    id: 'd55a0096-abd9-4183-ab8f-eb2a988abf12',
    token: '******',
  },
}

const builder = new ServerBuilder<Context>()

const appRouter = router(
  userContractCollection,
  builder.fulfill(userContractCollection).collect({
    create: async ({ body }) => {
      return {
        status: 201 as const,
        body: {
          ...fakeUser,
          ...body,
        },
      }
    },

    find: builder.fulfill(userContractCollection.find).resolver(({ params }) => {
      return {
        status: 200,
        body: {
          ...fakeUser,
          id: params.id,
        },
      }
    }),

    delete: builder.fulfill(userContractCollection.delete).resolver(() => {
      return {
        status: 204,
      }
    }),

    update: builder.fulfill(userContractCollection.update).resolver(({ params, body }) => {
      return {
        status: 200,
        body: {
          ...fakeUser,
          ...body,
          id: params.id,
        },
      }
    }),
  })
)

it('can find a user', { repeats: 5 }, async () => {
  const id = crypto.randomUUID()

  const result = await appRouter({
    path: '/users/' + id,
    method: 'GET',
    context,
    body: undefined,
    headers: undefined,
    query: undefined,
  })

  expect(result).toMatchObject({
    status: 200,
    body: {
      ...fakeUser,
      id,
    },
  })
})

it('can create a user', { repeats: 5 }, async () => {
  const name = crypto.randomUUID()
  const age = Math.floor(Math.random() * 100)
  const disabled = Math.random() > 0.5

  const result = await appRouter({
    path: '/users',
    method: 'POST',
    context,
    body: {
      name: name,
      age: age,
      disabled: disabled,
    },
    headers: undefined,
    query: undefined,
  })

  expect(result).toMatchObject({
    status: 201,
    body: {
      ...fakeUser,
      name,
      age,
      disabled,
    },
  })
})

it('can update a user', { repeats: 5 }, async () => {
  const id = crypto.randomUUID()
  const name = crypto.randomUUID()
  const age = Math.floor(Math.random() * 100) + 18
  const disabled = Math.random() > 0.5

  const result = await appRouter({
    path: '/users/' + id,
    method: 'PUT',
    context,
    body: {
      name: name,
      age: age,
      disabled: disabled,
    },
    headers: undefined,
    query: undefined,
  })

  expect(result).toMatchObject({
    status: 200,
    body: {
      ...fakeUser,
      name,
      age,
      disabled,
      id,
    },
  })
})

it('can delete a user', { repeats: 5 }, async () => {
  const id = crypto.randomUUID()

  const result = await appRouter({
    path: '/users/' + id,
    method: 'DELETE',
    context,
    body: undefined,
    headers: undefined,
    query: undefined,
  })

  expect(result).toMatchObject({
    status: 204,
  })
})
