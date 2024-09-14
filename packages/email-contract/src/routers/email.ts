import { z } from '@ownmailer/zod'
import { EmailListQueryInputSchema, EmailSchema, EmailSendBodyInputSchema } from 'src/schemas/email'
import { c } from 'src/tsr'

export const emailRouter = c.router({
  send: {
    method: 'POST',
    path: '/',
    body: EmailSendBodyInputSchema,
    responses: {
      201: EmailSchema,
    },
  },
  sendBatch: {
    method: 'POST',
    path: '/batch',
    body: z.array(EmailSendBodyInputSchema),
    responses: {
      201: z.array(EmailSchema),
    },
  },
  list: {
    method: 'GET',
    path: '/',
    query: EmailListQueryInputSchema,
    responses: {
      200: z.array(EmailSchema),
    },
  },
})
