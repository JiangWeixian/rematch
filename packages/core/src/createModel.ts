import * as R from './typings'

/**
 * inject reducer & effects typo on this
 * @param model
 */

export function createModel<S, RE extends R.ModelReducers<any>, E extends R.ModelEffects<any>, SS>(
  model: R.ModelDescriptor<S, RE, E, SS>,
): R.ModelDescriptor<S, RE, E, SS> {
  return model as R.ModelDescriptor<S, RE, E, SS>
}
