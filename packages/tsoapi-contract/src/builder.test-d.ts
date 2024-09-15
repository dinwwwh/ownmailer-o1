import { NewPetSchema, PetSchema, UserSchema } from 'src/__tests__/schemas'
import { object } from 'valibot'
import { contract, router } from './builder'

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
