import { Router } from 'src/router'
import { ContractResolverCollection } from 'src/types'

export async function fetchRequestAdapter<TRouter extends Router>(opts: {
  request: Request
  router: TRouter
  context: TRouter extends Router<infer TResolverCollection>
    ? TResolverCollection extends ContractResolverCollection<infer TContext>
      ? TContext
      : never
    : never
  prefix?: string
}): Promise<Response> {
  const prefix = opts.prefix ? (opts.prefix.startsWith('/') ? opts.prefix : '/' + opts.prefix) : '/'
  const url = new URL(opts.request.url)

  if (!url.pathname.startsWith(prefix)) {
    // TODO: improve error handling
    return new Response('Not Found', { status: 404 })
  }

  const body_text = await opts.request.text()
  const body = body_text ? JSON.parse(body_text) : undefined

  const result = await opts.router({
    context: opts.context,
    method: opts.request.method,
    path: url.pathname.replace(prefix, ''),
    body: body,
    headers: Object.fromEntries(opts.request.headers),
    query: Object.fromEntries(url.searchParams),
  })

  const headers = result.headers ?? {}

  return new Response(JSON.stringify(result.body), {
    status: result.status,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  })
}
