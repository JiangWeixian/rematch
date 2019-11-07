/* tslint-disable member-ordering */
import * as R from '../typings'

/**
 * Init Plugin
 *
 * Plugin for handling init async actions
 */
const initPlugin: R.Plugin = {
  // process async/await actions
  exposed: {
    initEffects: [],
  },
  onStoreCreated() {
    Object.keys(this.effects).map(key => {
      if (key.endsWith('__init')) {
        this.initEffects.push(this.effects[key])
      }
    })
  },
  middleware() {
    return next => async (action: R.Action) => {
      // async/await acts as promise middleware
      if (action.type === '@@INIT') {
        // tslint:disable-next-line:no-console
        console.log(Object.keys(this.initEffects))
        // await next(action)
        // return this.effects[action.type]()
      }
      return next(action)
    }
  },
}

export default initPlugin
