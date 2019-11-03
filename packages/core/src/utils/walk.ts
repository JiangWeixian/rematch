import { isModels } from './isModels'
import { validate } from './validate'

/**
 * similar with recurBindDispatch, same dispatch behaviours
 * @param modelName model.name
 * @param prefix model.name -> model.name/submodel.name -> model.name/submodel.name/reducername
 * @param effects model.effects
 * ```js
 * // option1
 * effects: {
 *   [effectName]: reducer
 * }
 * // option2
 * effects: {
 *   [submodelName]: ModelEffects // or recur option2
 * }
 * ```
 * @param normalizedEffects normalized model.effects
 * ```js
 * {
 *    [modelname/submodelname?/effectName]: effect
 * }
 * ```
 * @param dispatch store.dispatch
 * @param createDispatcher dispatchPlugin.createDispatcher
 * @param context
 */

type Callback = (
  prefix: string,
  key: string,
  actions: any,
  dispatch: any,
  effectOrreducer: Function,
) => void

export const walk = (
  modelName: string,
  prefix: string,
  effectsOrreducers: any,
  actions: any,
  dispatch: Function,
  callback: Callback,
) => {
  const keys = Object.keys(effectsOrreducers)
  if (isModels(effectsOrreducers)) {
    keys.forEach(key => {
      if (prefix.endsWith(key)) {
        const nextPrefix = prefix
        walk(modelName, nextPrefix, effectsOrreducers[key], actions, dispatch, callback)
      } else {
        const nextPrefix = key === modelName ? key : `${prefix}/${key}`
        walk(modelName, nextPrefix, effectsOrreducers[key], actions[key], dispatch[key], callback)
      }
    })
  } else {
    keys.forEach(key => {
      validate([
        [
          !!key.match(/\/.+\//) || !!key.match(/\//),
          `Invalid effect or reducer name (${prefix}/${key})`,
        ],
        [key === 'dispatch', `Effect or Reducer can not named 'dispatch'`],
        [
          typeof effectsOrreducers[key] !== 'function',
          `Invalid effect or reducer (${prefix}/${key}). Must be a function`,
        ],
      ])
      callback(prefix, key, actions, dispatch, effectsOrreducers[key])
    })
  }
}
