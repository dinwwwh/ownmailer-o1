import { z } from '@ownmailer/zod'
import { AWS_PREFIX_CONFIG_NAME } from 'src/config'

export type AWSConfig = z.infer<typeof AWSConfigSchema>
export type AWSConfigUpdateBodyInput = z.infer<typeof AWSConfigUpdateBodyInputSchema>

export const AWSCredentialsSchema = z.object({
  accessKeyId: z.string().openapi({ example: 'EXAMPLE' + '*'.repeat(13) }),
  secretAccessKey: z.string().openapi({ example: 'eXamPlE' + '*'.repeat(33) }),
})

export const AWSConfigSchema = z.object({
  name: z
    .string()
    .default('default')
    .describe(
      'The name of the AWS configuration to distinguish it from others. It will prefix with `' +
        AWS_PREFIX_CONFIG_NAME +
        '` automatically.'
    )
    .openapi({
      example: 'default',
    }),
  region: z.string().describe('The AWS region to send emails.').openapi({ example: 'us-east-1' }),
  credentials: AWSCredentialsSchema,
  queueUrl: z
    .string()
    .url()
    .describe('The SQS queue used to temporarily store email status.')
    .openapi({ example: 'https://sqs.us-east-1.amazonaws.com/123456789012/ownmailer' }),
})

export const AWSConfigUpdateBodyInputSchema = AWSConfigSchema.omit({ queueUrl: true })
