import * as R from './typings'
import { validate } from './utils/validate'
import memoize from 'lodash.memoize'

/**
 * inject reducer & effects typo on this
 * @param model
 */

export function createModel<S, RE extends R.ModelReducers<any>, E extends R.ModelEffects<any>, G extends R.ModelGetters<any>, SS>(
  model: R.ModelDescriptor<S, RE, E, G, SS>,
): R.ModelDescriptor<S, RE, E, G, SS> {
  validate([
    [
      model.effects && typeof model.effects === 'function',
      `Model.effects as function is not allowed`,
    ],
  ])
  if (model.getters && model.reducers) {
    ;(model.reducers as any)['getters'] = (state: S) => {
      const getters = {}
      Object.keys(model.getters as object)
        .forEach(k => {
          getters[k] = memoize((model.getters as object)[k](state))
        })
      return {
        ...state,
        ...getters,
      }
    }
  }
  if (model.lifecycle) {
    if (!model.effects) {
      model.effects = {} as E
    }
    ;(model.effects as any).__init = model.lifecycle.init
  }
  return model as R.ModelDescriptor<S, RE, E, G, SS>
}
