import { BaseIssue, BaseSchema, BaseSchemaAsync } from 'valibot'

export type AllowedMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
export type AllowedSchema =
  | BaseSchema<unknown, unknown, BaseIssue<unknown>>
  | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>

export interface Contract<
  TResponses extends ContractResponses = ContractResponses,
  TPath extends string = string,
  TMethod extends AllowedMethod = AllowedMethod,
  TParamsSchema extends AllowedSchema = AllowedSchema,
  TQuerySchema extends AllowedSchema = AllowedSchema,
  TBodySchema extends AllowedSchema = AllowedSchema,
  THeadersSchema extends AllowedSchema = AllowedSchema
> {
  path: TPath
  method: TMethod
  // TODO: params MUST match the path params
  params?: TParamsSchema
  query?: TQuerySchema
  body?: TBodySchema
  headers?: THeadersSchema
  responses?: TResponses
}

export type ContractCollection<T extends Record<string, Contract | ContractCollection> = any> = T

export interface ContractResponse<
  TBodySchema extends AllowedSchema = AllowedSchema,
  THeadersSchema extends AllowedSchema = AllowedSchema
> {
  description: string
  body?: TBodySchema
  headers?: THeadersSchema
}

export type ContractResponses = Record<number, ContractResponse>
