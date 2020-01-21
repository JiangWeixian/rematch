import * as R from './typings'
import { createGetters } from './utils/createGetters'
import { validate } from './utils/validate'

/**
 * inject reducer & effects typo on this
 * @param model
 */

export function createModel<S, SS>(
  model: R.ModelDescriptor<S, any, any, any, SS>,
): R.ModelDescriptor<S, any, any, any, SS> {
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
    model.reducers.__getters = createGetters(model.getters)
    model.state = model.reducers.__getters(model.state)
  }
  if (model.lifecycle) {
    if (!model.effects) {
      model.effects = {}
    }
    model.effects.__init = model.lifecycle.init
  }
  return model as R.ModelDescriptor<S, any, any, any, SS>
}
