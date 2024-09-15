import { Contract } from './types'

export function isLeafContract<T extends unknown | Contract>(
  contract: T
): contract is Exclude<T, unknown> {
  if (typeof contract !== 'object' || contract === null) return false

  if (!('path' in contract) || typeof contract.path !== 'string') return false
  if (!('method' in contract) || typeof contract.method !== 'string') return false
  if (!('response' in contract) || typeof contract.response !== 'object') return false
  if (!('params' in contract) || typeof contract.params !== 'object') return false
  if (!('query' in contract) || typeof contract.query !== 'object') return false
  if (!('headers' in contract) || typeof contract.headers !== 'object') return false

  return true
}
