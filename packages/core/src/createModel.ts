import * as R from './typings'
import { createGetters } from './utils/createGetters'
import { validate } from './utils/validate'

/**
 * inject reducer & effects typo on this
 * @param model
 */

export function createModel<S, RE extends R.ModelReducers<any>, E extends R.ModelEffects<any>, SS>(
  model: R.ModelDescriptor<S, RE, E, any, SS>,
): R.ModelDescriptor<S, RE, E, any, SS> {
  validate([
    [
      model.effects && typeof model.effects === 'function',
      `Model.effects as function is not allowed`,
    ],
    [
      model.getters && typeof model.state !== 'object',
      `Model.state should be object if Model.getters exited`,
    ],
  ])
  if (model.getters) {
    model.getters = createGetters(model.getters)
    model.state['getters'] = model.getters(model.state)
  }
  if (model.lifecycle) {
    if (!model.effects) {
      model.effects = {} as E
    }
    ;(model.effects as any).__init = model.lifecycle.init
  }
  return model as R.ModelDescriptor<S, RE, E, any, SS>
}
