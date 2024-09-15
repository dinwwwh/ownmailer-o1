import { InferInput } from 'valibot'
import { NewPetSchema, NewUserSchema, PetSchema, UserSchema } from './schemas'

export const fakePet: InferInput<typeof PetSchema> = {
  id: 'd55a0096-abd9-4183-ab8f-eb2a988abf11',
  name: 'Din',
  type: 'cat',
}

export const fakeNewPet: InferInput<typeof NewPetSchema> = {
  name: 'Din',
  type: 'cat',
}

export const fakeUser: InferInput<typeof UserSchema> = {
  id: 'd55a0096-abd9-4183-ab8f-eb2a988abf12',
  name: 'Din',
  age: 18,
  disabled: false,
  pets: [fakePet],
}

export const fakeNewUser: InferInput<typeof NewUserSchema> = {
  name: 'Din',
  age: 18,
  disabled: false,
}
