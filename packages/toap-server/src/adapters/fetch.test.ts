import { fakeUser } from 'src/__tests__/fakes'
import { appRouter, context } from 'src/__tests__/router'
import { expect, it } from 'vitest'
import { fetchRequestAdapter } from './fetch'

const prefixes = ['/api/', '/api', '/', undefined, '/hehe//', '//huhu', '/hu/hu//']

it.each(prefixes)('can handle not found: %s', async (prefix) => {
  const request = new Request(`http://dinwwwh.com${prefix}/not-found`)

  const response = await fetchRequestAdapter({
    request,
    context: context,
    router: appRouter,
    prefix,
  })

  expect(response.status).toBe(404)
})

it.each(prefixes)('can find user: %s', async (prefix) => {
  const id = crypto.randomUUID()

  const request = new Request(`http://dinwwwh.com${prefix}/users/` + id)

  const response = await fetchRequestAdapter({
    request,
    context: context,
    router: appRouter,
    prefix,
  })

  expect(response.status).toBe(200)

  const result = await response.json()

  expect(result).toMatchObject({
    ...fakeUser,
    id,
  })
})

it.each(prefixes)('can create user: %s', async (prefix) => {
  const name = crypto.randomUUID()
  const age = Math.floor(Math.random() * 100) + 18
  const disabled = Math.random() > 0.5

  const request = new Request(`http://dinwwwh.com${prefix}/users`, {
    method: 'POST',
    body: JSON.stringify({
      name: name,
      age: age,
      disabled: disabled,
    }),
  })

  const response = await fetchRequestAdapter({
    request,
    context: context,
    router: appRouter,
    prefix,
  })

  expect(response.status).toBe(201)

  const result = await response.json()

  expect(result).toMatchObject({
    ...fakeUser,
    name,
    age,
    disabled,
  })
})
