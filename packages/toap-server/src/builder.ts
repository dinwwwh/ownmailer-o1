import { Contract, ContractsRouter, isContract } from '@toap/contract'
import { Context, ContractHandler, ContractHandlersRouter } from './types'

export class ServerBuilder<TContext extends Context = Context> {
  context<TContext extends Context = Context>(): ServerBuilder<TContext> {
    return this as unknown as ServerBuilder<TContext>
  }

  implement<Ctr extends Contract | ContractsRouter>(
    contract: Ctr
  ): Ctr extends Contract
    ? ContractHandlerBuilder<TContext, Ctr>
    : ContractHandlersRouterBuilder<TContext, Ctr> {
    if (isContract(contract)) {
      return new ContractHandlerBuilder(contract) as any
    }

    return new ContractHandlersRouterBuilder(contract) as any
  }
}

export class ContractHandlerBuilder<
  TContext extends Context = Context,
  TContract extends Contract = Contract
> {
  constructor(private readonly contract: TContract) {}
  handler<THandler extends ContractHandler<TContext, TContract>>(handler: THandler): THandler {
    return handler
  }
}

export class ContractHandlersRouterBuilder<
  TContext extends Context = Context,
  TContracts extends ContractsRouter = ContractsRouter,
  TContractHandlersRouter = ContractHandlersRouter<TContext, TContracts>
> {
  constructor(private readonly contracts: TContracts) {}
  router(contractHandlers: TContractHandlersRouter): TContractHandlersRouter {
    return contractHandlers
  }
}
