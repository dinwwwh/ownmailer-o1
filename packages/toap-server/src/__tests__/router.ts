import { ServerBuilder } from 'src/builder'
import { router } from 'src/router'
import { userContractCollection } from './contract'
import { fakeUser } from './fakes'

interface Context {
  auth?: {
    id: string
    token: string
  }

  db: 'mysql' | 'postgres'
}

export const context: Context = {
  db: 'mysql',
  auth: {
    id: 'd55a0096-abd9-4183-ab8f-eb2a988abf12',
    token: '******',
  },
}

export const builder = new ServerBuilder<Context>()

export const appRouter = router(
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
