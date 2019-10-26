import Rematch from './rematch'
import * as R from './typings'
import mergeConfig from './utils/mergeConfig'

// incrementer used to provide a store name if none exists
let count = 0

/**
 * init
 *
 * generates a Rematch store
 * with a set configuration
 * @param config
 */
export const init = <M extends R.Models>(initConfig: R.InitConfig<M> = {}): R.RematchStore<M> => {
  const name = initConfig.name || count.toString()
  count += 1
  const config: R.Config = mergeConfig({ ...initConfig, name })
  return new Rematch(config).init()
}

export default {
  init,
}
