import { AllowedMethod } from '@toap/contract'
import Router from 'trek-router'
import {
  ContractResolver,
  ContractResolverCollection,
  ContractResolverInput,
  ContractResolverOutput,
} from './types'

export type RouterInput<TCollection extends ContractResolverCollection> =
  (TCollection extends ContractResolverCollection<infer Context>
    ? ContractResolverInput<Context>
    : ContractResolverInput) & { method: AllowedMethod; path: string }

export function createResolverCollectionRouter<TCollection extends ContractResolverCollection>(
  collection: TCollection
): (input: RouterInput<TCollection>) => ContractResolverOutput {
  const router = new Router<ContractResolver>()

  // TODO: add all resolvers into the router

  return (input: RouterInput<TCollection>): ContractResolverOutput => {
    const [resolver, paramsArr] = router.find(input.method, input.path)

    // TODO: handle separate case 405: Method is not allowed and make 501 only: path is not implemented
    if (!resolver) {
      return {
        status: 501,
        body: {
          message: 'Method is not allowed or path is not implemented',
        },
      }
    }

    const params: Record<string, string> = {}
    for (const { name, value } of paramsArr) {
      params[name] = value
    }

    // TODO: validate params
    // TODO: validate body
    // TODO: validate headers

    return resolver({
      params,
      body: input.body,
      headers: input.headers,
      query: input.query,
      context: input.context,
    })
  }
}
