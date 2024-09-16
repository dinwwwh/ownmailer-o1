import { AllowedMethod, Contract, ContractCollection, isContract } from '@toap/contract'
import Router from 'trek-router'
import { isValiError, parseAsync } from 'valibot'
import { ContractResolver, ContractResolverCollection, ContractResolverInput } from './types'
import { convertOpenapiPathToTrekRouterPath } from './utils/router'

export type RouterInput<TCollection extends ContractResolverCollection> = Omit<
  TCollection extends ContractResolverCollection<infer Context>
    ? ContractResolverInput<Context>
    : ContractResolverInput,
  'params'
> & { method: AllowedMethod; path: string }

export type RouterOutput = {
  status: number
  body?: unknown
  headers?: unknown
}

export function router<
  TResolverCollection extends ContractResolverCollection = ContractResolverCollection
>(
  contractCollection: TResolverCollection extends ContractResolverCollection<
    infer _,
    infer ContractCollection
  >
    ? ContractCollection
    : never,
  resolverCollection: TResolverCollection
): (input: RouterInput<TResolverCollection>) => Promise<RouterOutput> {
  const router = new Router<[Contract, ContractResolver]>()

  // TODO: add all resolvers into the router
  const addToRouterRecursively = (
    contractCollection: ContractCollection,
    resolverCollection: ContractResolverCollection
  ) => {
    for (const key in contractCollection) {
      const item_c = contractCollection[key]
      const item_r = resolverCollection[key]

      if (!item_c || !item_r) {
        throw new Error('Contract and its resolver mismatch, please use `tsc` to check')
      }

      if (isContract(item_c)) {
        if (typeof item_r !== 'function') {
          throw new Error('Contract and its resolver mismatch, please use `tsc` to check')
        }

        router.add(item_c.method, convertOpenapiPathToTrekRouterPath(item_c.path), [item_c, item_r])
      } else {
        addToRouterRecursively(item_c, item_r as ContractResolverCollection)
      }
    }
  }

  addToRouterRecursively(contractCollection, resolverCollection)

  return async (input: RouterInput<TResolverCollection>): Promise<RouterOutput> => {
    try {
      const [match, paramsArr] = router.find(input.method, input.path)

      // TODO: handle separate case 405: Method is not allowed and make 501 only: path is not implemented
      if (!match) {
        return {
          status: 501,
          body: {
            message: 'Method is not allowed or path is not implemented',
          },
        }
      }

      const [contract, resolver] = match

      const params: Record<string, string> = {}
      for (const { name, value } of paramsArr) {
        params[name] = value
      }

      const [validParams, validQuery, validHeaders, validBody] = await Promise.all([
        (async () => {
          if (!contract.params) return params

          return await parseAsync(contract.params, params)
        })(),
        (async () => {
          if (!contract.query) return input.query

          return await parseAsync(contract.query, input.query)
        })(),
        (async () => {
          if (!contract.headers) return input.headers

          return await parseAsync(contract.headers, input.headers)
        })(),
        (async () => {
          if (!contract.body) return input.body

          return await parseAsync(contract.body, input.body)
        })(),
      ])

      const result = await resolver({
        context: input.context,
        params: validParams,
        query: validQuery,
        headers: validHeaders,
        body: validBody,
      })

      if (typeof result === 'object' && result !== null) {
        return result as RouterOutput
      }

      return {
        status: 204,
      }
    } catch (e) {
      // TODO: improve validation error
      if (isValiError(e)) {
        return {
          status: 422,
          body: {
            message: e.message,
          },
        }
      }

      return {
        status: 500,
        body: {
          message: 'Internal server error',
        },
      }
    }
  }
}
