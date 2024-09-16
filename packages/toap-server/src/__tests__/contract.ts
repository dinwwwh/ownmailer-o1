import { contract, router } from '@toap/contract'
import { object, string } from 'valibot'
import { NewPetSchema, NewUserSchema, PetSchema, UserSchema } from './schemas'

const findPetContract = contract({
  method: 'GET',
  path: '/pets/{id}',
  params: object({
    id: PetSchema.entries.id,
  }),
  responses: {
    200: {
      description: 'The pet matching the given id',
      body: UserSchema,
    },
  },
})

const createPetContract = contract({
  method: 'POST',
  path: '/pets',
  body: NewPetSchema,
  responses: {
    201: {
      description: 'The created pet',
      body: PetSchema,
    },
  },
})

const updatePetContract = contract({
  method: 'PUT',
  path: '/pets/{id}',
  params: object({
    id: PetSchema.entries.id,
  }),
  body: NewPetSchema,
  responses: {
    200: {
      description: 'The updated pet',
      body: PetSchema,
    },
  },
})

const deletePetContract = contract({
  method: 'DELETE',
  path: '/pets/{id}',
  params: object({
    id: PetSchema.entries.id,
  }),
  responses: {
    204: {
      description: 'The pet matching the given id has been deleted',
    },
  },
})

export const petRouter = router({
  find: findPetContract,
  create: createPetContract,
  update: updatePetContract,
  delete: deletePetContract,
})

export const findUserContract = contract({
  method: 'GET',
  path: '/users/{id}',
  params: object({
    id: UserSchema.entries.id,
  }),
  responses: {
    200: {
      description: 'The user matching the given id',
      body: UserSchema,
    },
  },
})

export const createUserContract = contract({
  method: 'POST',
  path: '/users',
  body: NewUserSchema,
  responses: {
    201: {
      description: 'The created user',
      body: UserSchema,
    },
  },
})

export const updateUserContract = contract({
  method: 'PUT',
  path: '/users/{id}',
  params: object({
    id: UserSchema.entries.id,
  }),
  body: NewUserSchema,
  responses: {
    200: {
      description: 'The updated user',
      body: UserSchema,
    },
  },
})

export const deleteUserContract = contract({
  method: 'DELETE',
  path: '/users/{id}',
  params: object({
    id: UserSchema.entries.id,
  }),
  responses: {
    204: {
      description: 'The user matching the given id has been deleted',
    },
  },
})

export const userRouter = router({
  find: findUserContract,
  create: createUserContract,
  update: updateUserContract,
  delete: deleteUserContract,
})

const pingContract = contract({
  method: 'GET',
  path: '/ping',
  responses: {
    200: {
      description: 'Check if the server is alive',
      headers: object({
        'x-timestamp': string(),
      }),
    },
  },
})

export const appRouter = router({
  ping: pingContract,
  pet: petRouter,
  user: userRouter,
})
