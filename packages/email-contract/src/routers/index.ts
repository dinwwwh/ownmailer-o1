import { c } from 'src/tsr'
import { configRouter } from './config'
import { emailRouter } from './email'
import { identityRouter } from './identity'

export const contract = c.router({
  config: c.router(configRouter, { pathPrefix: '/configs' }),
  email: c.router(emailRouter, { pathPrefix: '/emails' }),
  identity: c.router(identityRouter, { pathPrefix: '/identities' }),
})
