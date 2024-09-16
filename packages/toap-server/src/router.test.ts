import { expect, it } from 'vitest'
import { fakeUser } from './__tests__/fakes'
import { appRouter, context } from './__tests__/router'

it('can handle not found', { repeats: 5 }, async () => {
  const result = await appRouter({
    path: '/not-found',
    method: 'GET',
    context,
    body: undefined,
    headers: undefined,
    query: undefined,
  })

  expect(result).toMatchObject({
    status: 404,
    body: {
      message: 'Not found',
    },
  })
})

it('can find a user', { repeats: 5 }, async () => {
  const id = crypto.randomUUID()

  const result = await appRouter({
    path: '/users/' + id,
    method: 'GET',
    context: context,
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
  const age = Math.floor(Math.random() * 100) + 18
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
