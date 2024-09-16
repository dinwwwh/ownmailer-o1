import type {
  AllowedSchema,
  Contract,
  ContractCollection,
  ContractResponse,
  ContractResponses,
} from '@toap/contract'
import { InferInput } from 'valibot'
import { IsEqual, Promisable } from './utils/types'

// TODO: it should me Record<string | number | symbol, unknown>
export type AllowedContext = any

export interface ContractResolver<
  TContext extends AllowedContext = AllowedContext,
  TContract extends Contract = Contract
> {
  (input: ContractResolverInput<TContext, TContract>): Promisable<ContractResolverOutput<TContract>>
}

export type ContractResolverInput<
  TContext extends AllowedContext = AllowedContext,
  TContract extends Contract = Contract
> = TContract extends Contract<
  infer _Responses,
  infer _Path,
  infer _Method,
  infer ParamsSchema,
  infer QuerySchema,
  infer BodySchema,
  infer HeadersSchema
>
  ? {
      context: TContext
      params: InferInput<ParamsSchema>
      query: InferInput<QuerySchema>
      body: InferInput<BodySchema>
      headers: InferInput<HeadersSchema>
    }
  : never

export type ContractResolverOutput<
  TContract extends Contract = Contract,
  TResponses = TContract extends Contract<infer Responses> ? Responses : never,
  TBodySchema = TResponses[keyof TResponses] extends ContractResponse<infer BodySchema>
    ? BodySchema
    : never,
  THeadersSchema = TResponses[keyof TResponses] extends ContractResponse<any, infer HeadersSchema>
    ? HeadersSchema
    : never
> = IsEqual<TResponses, ContractResponses> extends true
  ? unknown
  : {
      status: keyof TResponses
    } & (TBodySchema extends AllowedSchema
      ? IsEqual<InferInput<TBodySchema>, unknown> extends true
        ? { body?: unknown }
        : { body: InferInput<TBodySchema> }
      : { body?: unknown }) &
      (THeadersSchema extends AllowedSchema
        ? IsEqual<InferInput<THeadersSchema>, unknown> extends true
          ? { headers?: unknown }
          : { headers: InferInput<THeadersSchema> }
        : { headers?: unknown })

export type ContractResolverCollection<
  TContext extends AllowedContext = AllowedContext,
  TContractCollection extends ContractCollection = ContractCollection
> = {
  [K in keyof TContractCollection]: TContractCollection[K] extends Contract
    ? ContractResolver<TContext, TContractCollection[K]>
    : ContractResolverCollection<TContext, TContractCollection[K]>
}
