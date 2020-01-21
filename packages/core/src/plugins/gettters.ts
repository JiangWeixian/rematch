/* tslint-disable member-ordering */
import * as R from '../typings'
import { getCurrentModelState } from '../utils/getCurrentModelState'

/**
 * Getters Plugin
 *
 * Plugin for handling getters
 */
const gettersPlugin: R.Plugin = {
  // process async/await actions
  middleware(store) {
    return next => (action: R.Action) => {
      if (!action.type.endsWith('__getters')) {
        next(action)
        const name = action.type.split('/')[0]
        const keys = Object.keys(this.reducers).filter((key: string) => {
          return key.startsWith(name) && key.endsWith('__getters')
        })
        keys.forEach(key => {
          this.reducers[key](getCurrentModelState(store.getState(), key))
        })
        return store.getState()
      } else {
        return next(action)
      }
    }
  },
}

export default gettersPlugin
