import { Contract } from './types'

// TODO: add more checks
export function isContract<T extends unknown | Contract>(
  contract: T
): contract is Exclude<T, unknown> {
  if (typeof contract !== 'object' || contract === null) return false

  if (!('path' in contract) || typeof contract.path !== 'string') return false
  if (!('method' in contract) || typeof contract.method !== 'string') return false
  if ('responses' in contract && typeof contract.responses !== 'object') return false
  if ('params' in contract && typeof contract.params !== 'object') return false
  if ('query' in contract && typeof contract.query !== 'object') return false
  if ('headers' in contract && typeof contract.headers !== 'object') return false

  return true
}
