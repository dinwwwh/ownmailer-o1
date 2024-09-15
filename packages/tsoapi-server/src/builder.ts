import { Contract, ContractsRouter, isLeafContract } from '@tsoapi/contract'
import { Context, ContractHandler, ContractHandlersRouter } from './types'

export class ServerBuilder<TContext extends Context = Context> {
  context<TContext extends Context = Context>(): ServerBuilder<TContext> {
    return this as unknown as ServerBuilder<TContext>
  }

  implement<
    Ctr extends Contract | ContractsRouter,
    Rtn = Ctr extends Contract
      ? ContractHandlerBuilder<TContext, Ctr>
      : ContractHandlersRouterBuilder<TContext, Ctr>
  >(contract: Ctr): Rtn {
    if (isLeafContract(contract)) {
      return new ContractHandlerBuilder(contract) as Rtn
    }

    return new ContractHandlersRouterBuilder(contract) as Rtn
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
