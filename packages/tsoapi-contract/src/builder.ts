import { Contract, ContractsRouter } from './types'

export function contract<T extends Contract>(contract: T): T {
  return contract
}

export function router<T extends ContractsRouter>(contracts: T): T {
  return contracts
}
