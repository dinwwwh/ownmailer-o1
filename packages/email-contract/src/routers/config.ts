import { AWSConfigSchema, AWSConfigUpdateBodyInputSchema } from 'src/schemas/config'
import { c } from 'src/tsr'

export const configRouter = c.router({
  getAWSConfig: {
    method: 'GET',
    path: '/aws',
    responses: {
      200: AWSConfigSchema.nullable(),
    },
  },
  updateAWSConfig: {
    method: 'POST',
    path: '/aws',
    body: AWSConfigUpdateBodyInputSchema,
    responses: {
      200: AWSConfigSchema,
    },
  },
})
