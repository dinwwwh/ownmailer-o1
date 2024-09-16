import type {
  AllowedSchema,
  Contract,
  ContractResponse,
  ContractResponses,
  ContractsRouter,
} from '@toap/contract'
import { InferInput } from 'valibot'
import { IsEqual, Promisable } from './utils/types'

export type Context = {
  [key: string | number | symbol]: unknown
}

export interface ContractHandler<
  TContext extends Context = Context,
  TContract extends Contract = Contract
> {
  (input: ContractHandlerInput<TContext, TContract>): Promisable<ContractHandlerOutput<TContract>>
}

export type ContractHandlerInput<
  TContext extends Context = Context,
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

export type ContractHandlerOutput<
  TContract extends Contract = Contract,
  TResponses = TContract extends Contract<infer Responses> ? Responses : never,
  TBodySchema = TResponses[keyof TResponses] extends ContractResponse<infer BodySchema>
    ? BodySchema
    : never,
  THeadersSchema = TResponses[keyof TResponses] extends ContractResponse<any, infer HeadersSchema>
    ? HeadersSchema
    : never
> = IsEqual<TResponses, ContractResponses> extends true
  ? void
  : {
      status: keyof TResponses
    } & (TBodySchema extends AllowedSchema
      ? InferInput<TBodySchema> extends never
        ? { body?: never }
        : { body: InferInput<TBodySchema> }
      : { body?: never }) &
      (THeadersSchema extends AllowedSchema
        ? InferInput<THeadersSchema> extends never
          ? { headers?: never }
          : { headers: InferInput<THeadersSchema> }
        : { headers?: never })

export type ContractHandlersRouter<
  TContext extends Context = Context,
  TContractsRouter extends ContractsRouter = ContractsRouter
> = {
  [K in keyof TContractsRouter]: TContractsRouter[K] extends Contract
    ? ContractHandler<TContext, TContractsRouter[K]>
    : ContractHandlersRouter<TContext, TContractsRouter[K]>
}
