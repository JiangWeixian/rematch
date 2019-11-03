/* tslint-disable member-ordering */
import * as R from '../typings'
import { getCurrentModelState } from '../utils/getCurrentModelState'
import { isModels } from '../utils/isModels'
import validate from '../utils/validate'

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
const recurBindEffectDispatch = (
  modelName: string,
  prefix: string,
  effects: any,
  actions: any,
  normalizedEffects: any,
  dispatch: Function,
  createDispatcher: Function,
  context: any,
) => {
  validate([[typeof effects === 'function', `Model.effects as function is not allowed`]])
  const effectKeys = Object.keys(effects)
  if (isModels(effects)) {
    effectKeys.forEach(key => {
      if (prefix.endsWith(key)) {
        const nextPrefix = prefix
        recurBindEffectDispatch(
          modelName,
          nextPrefix,
          effects[key],
          actions,
          normalizedEffects,
          dispatch,
          createDispatcher,
          context,
        )
      } else {
        const nextPrefix = key === modelName ? key : `${prefix}/${key}`
        recurBindEffectDispatch(
          modelName,
          nextPrefix,
          effects[key],
          actions[key],
          normalizedEffects,
          dispatch[key],
          createDispatcher,
          context,
        )
      }
    })
  } else {
    effectKeys.forEach(key => {
      validate([
        [!!key.match(/\/.+\//) || !!key.match(/\//), `Invalid effect name (${prefix}/${key})`],
        [key === 'dispatch', `Effect can not named 'dispatch'`],
        [
          typeof effects[key] !== 'function',
          `Invalid effect (${prefix}/${key}). Must be a function`,
        ],
      ])
      normalizedEffects[`${prefix}/${key}`] = effects[key].bind(dispatch)
      actions[key] = createDispatcher(prefix, key)
      dispatch[key] = async (payload: any, meta: any) => {
        const action = await actions[key](payload, meta)
        context.dispatch(action)
      }
      dispatch[key].isEffect = true
    })
  }
}

/**
 * Effects Plugin
 *
 * Plugin for handling async actions
 */
const effectsPlugin: R.Plugin = {
  exposed: {
    // expose effects for access from dispatch plugin
    effects: {},
  },

  // add effects to dispatch so that dispatch[modelName][effectName] calls an effect
  onModel(model: R.Model): void {
    if (!model.effects) {
      return
    }
    recurBindEffectDispatch(
      model.name,
      model.name,
      model.effects,
      this.actions[model.name],
      this.effects,
      this.dispatch[model.name],
      this.createDispatcher,
      this,
    )
    this.dispatch[model.name].dispatch = this.dispatch
  },

  // process async/await actions
  middleware(store) {
    return next => async (action: R.Action) => {
      // async/await acts as promise middleware
      if (action.type in this.effects) {
        await next(action)
        return this.effects[action.type](
          action.payload,
          store.getState(),
          getCurrentModelState(store.getState(), action.type),
          action.meta,
        )
      }
      return next(action)
    }
  },
}

export default effectsPlugin
