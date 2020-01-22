/* tslint-disable member-ordering */
import * as R from '../typings'

/**
 * Lifecycle Plugin
 *
 * Plugin for handling lifecycle
 * 1. init
 */
const initPlugin: R.Plugin = {
  onStoreCreated(store) {
    // init
    Object.keys(this.effects).map(key => {
      if (key.endsWith('__init')) {
        store.dispatch({ type: key })
      }
    })
  },
}

export default initPlugin
