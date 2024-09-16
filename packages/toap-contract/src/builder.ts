import { Contract, ContractCollection } from './types'

export function contract<T extends Contract>(contract: T): T {
  return contract
}

export function collect<T extends ContractCollection>(contracts: T): T {
  return contracts
}
