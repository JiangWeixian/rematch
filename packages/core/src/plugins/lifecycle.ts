/* tslint-disable member-ordering */
import * as R from '../typings'

/**
 * Lifecycle Plugin
 *
 * Plugin for handling init async actions
 */
const initPlugin: R.Plugin = {
  onStoreCreated(store) {
    Object.keys(this.effects).map(key => {
      if (key.endsWith('__init')) {
        store.dispatch({ type: key })
      }
    })
  },
}

export default initPlugin
