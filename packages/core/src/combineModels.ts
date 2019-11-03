import * as R from './typings'
import { validate } from './utils/validate'

export function combineModels<
  M extends R.Models,
  RE extends R.ModelReducers<R.ExtractRematchStateFromModels<M>>,
  E extends R.ModelEffects<any>
>({
  name,
  models,
  reducers,
  effects,
  baseReducer,
}: {
  name: string
  models: M
  reducers?: RE
  effects?: E
  baseReducer?: R.ModelConfig<any>['baseReducer']
}): R.CombinedModel<M, RE, E> {
  const modelKeys = Object.keys(models)
  const finalModels = {} as R.Models
  modelKeys.forEach(key => {
    validate([[typeof models[key] === 'undefined', `No model provided for key ${key}`]])

    if (typeof models[key] === 'object') {
      finalModels[key] = models[key]
      validate([[!!models[key].baseReducer, 'SubModel.baseReducer will be ignore']])
    }
  })
  const finalModelKeys = Object.keys(finalModels)
  const finalModel = {
    name,
    state: {},
    reducers: {},
    effects: {},
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
  finalModel.baseReducer = baseReducer
  return finalModel as any
}
