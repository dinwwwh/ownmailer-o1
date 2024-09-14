import { z } from '@ownmailer/zod'
import { IdentitySchema } from 'src/schemas/identity'
import { c } from 'src/tsr'

export const identityRouter = c.router({
  list: {
    method: 'GET',
    path: '/',
    responses: {
      200: z.array(IdentitySchema),
    },
  },
})
