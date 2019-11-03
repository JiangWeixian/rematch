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

type ActionCallback = (
  prefix: string,
  key: string,
  actions: any,
  dispatch: any,
  effectOrreducer: Function,
) => void

export const walk = ({
  modelName,
  prefix,
  effectsOrreducers,
  actions,
  dispatch,
  onActionCallback,
}: {
  modelName: string
  prefix: string
  effectsOrreducers: any
  actions: any
  dispatch: Function
  onActionCallback?: ActionCallback
}) => {
  const keys = Object.keys(effectsOrreducers)
  if (isModels(effectsOrreducers)) {
    keys.forEach(key => {
      if (prefix.endsWith(key)) {
        walk({
          modelName,
          prefix,
          effectsOrreducers: effectsOrreducers[key],
          actions,
          dispatch,
          onActionCallback,
        })
      } else {
        const nextPrefix = key === modelName ? key : `${prefix}/${key}`
        actions[key] = actions[key] || {}
        dispatch[key] = dispatch[key] || {}
        walk({
          modelName,
          prefix: nextPrefix,
          effectsOrreducers: effectsOrreducers[key],
          actions: actions[key],
          dispatch: dispatch[key],
          onActionCallback,
        })
      }
    })
  } else {
    keys.forEach(key => {
      if (!onActionCallback) {
        return
      }
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
      onActionCallback(prefix, key, actions, dispatch, effectsOrreducers[key])
    })
  }
}
