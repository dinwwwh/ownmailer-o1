import { Contract, ContractCollection, isContract } from '@toap/contract'
import { AllowedContext, ContractResolver, ContractResolverCollection } from './types'

export class ServerBuilder<TContext extends AllowedContext = AllowedContext> {
  context<TContext extends AllowedContext = AllowedContext>(): ServerBuilder<TContext> {
    return this as unknown as ServerBuilder<TContext>
  }

  fulfill<Ctr extends Contract | ContractCollection>(
    contract: Ctr
  ): Ctr extends Contract
    ? ContractResolverBuilder<TContext, Ctr>
    : ContractResolverCollectionBuilder<TContext, Ctr> {
    if (isContract(contract)) {
      return new ContractResolverBuilder(contract) as any
    }

    return new ContractResolverCollectionBuilder(contract) as any
  }
}

export class ContractResolverBuilder<
  TContext extends AllowedContext = AllowedContext,
  TContract extends Contract = Contract
> {
  constructor(private readonly contract: TContract) {}
  resolver<TResolver extends ContractResolver<TContext, TContract>>(
    resolver: TResolver
  ): TResolver {
    return resolver
  }
}

export class ContractResolverCollectionBuilder<
  TContext extends AllowedContext = AllowedContext,
  TContracts extends ContractCollection = ContractCollection,
  TContractResolverCollection = ContractResolverCollection<TContext, TContracts>
> {
  constructor(private readonly contracts: TContracts) {}
  collect(collection: TContractResolverCollection): TContractResolverCollection {
    return collection
  }
}
