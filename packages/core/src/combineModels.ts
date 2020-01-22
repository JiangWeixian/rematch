import * as R from './typings'
import { createGetters } from './utils/createGetters'
import { validate } from './utils/validate'

export function combineModels<
  M extends R.Models,
  RE extends R.ModelReducers<R.ExtractRematchStateFromModels<M>>,
  E extends R.ModelEffects<any>,
  G extends R.ModelGetters<any>
>({
  name,
  models,
  reducers,
  effects,
  getters,
  lifecycle,
  baseReducer,
}: {
  name: string
  models: M
  reducers?: RE
  effects?: E
  getters?: G
  lifecycle?: R.LifeCycle
  baseReducer?: R.ModelConfig<any>['baseReducer']
}): R.CombinedModel<M, RE, E> {
  const modelKeys = Object.keys(models)
  const finalModels = {} as R.Models
  modelKeys.forEach(key => {
    validate([
      [typeof models[key] === 'undefined', `No model provided for key ${key}`],
      [typeof effects === 'function', `Model.effects as function is not allowed`],
    ])

    if (typeof models[key] === 'object') {
      finalModels[key] = models[key]
      validate([[!!models[key].baseReducer, 'SubModel.baseReducer not supported now!']])
    }
  })
  const finalModelKeys = Object.keys(finalModels)
  const finalModel = {
    name,
    state: {},
    reducers: {},
    effects: {},
    getters: {},
    baseReducer,
  }
  // set state, reducers, effects
  finalModelKeys.forEach(key => {
    finalModel.state[key] = finalModels[key].state
    if (finalModels[key].reducers) {
      finalModel.reducers[key] = finalModels[key].reducers
    }
    if (finalModels[key].effects) {
      finalModel.effects[key] = finalModels[key].effects
    }
  })
  if (reducers) {
    finalModel.reducers[name] = reducers
  }
  if (effects) {
    validate([[typeof effects === 'function', `Model.effects as function is not allowed`]])
    finalModel.effects[name] = effects
  }
  if (getters) {
    finalModel.reducers[name]['__getters'] = createGetters(getters)
    finalModel.state = finalModel.reducers[name]['__getters'](finalModel.state)
  }
  if (lifecycle) {
    if (!effects) {
      finalModel.effects[name] = {}
    }
    finalModel.effects[name].__init = lifecycle.init
  }
  finalModel.baseReducer = baseReducer
  return finalModel as any
}
