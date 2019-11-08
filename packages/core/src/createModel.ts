import * as R from './typings'
import { validate } from './utils/validate'

/**
 * inject reducer & effects typo on this
 * @param model
 */

export function createModel<S, RE extends R.ModelReducers<any>, E extends R.ModelEffects<any>, SS>(
  model: R.ModelDescriptor<S, RE, E, SS>,
): R.ModelDescriptor<S, RE, E, SS> {
  validate([
    [
      model.effects && typeof model.effects === 'function',
      `Model.effects as function is not allowed`,
    ],
  ])
  if (model.lifecycle) {
    if (!model.effects) {
      model.effects = {} as E
    }
    // tslint:disable-next-line:align semicolon
    ;(model.effects as any).__init = model.lifecycle.init
  }
  return model as R.ModelDescriptor<S, RE, E, SS>
}
