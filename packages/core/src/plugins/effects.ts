/* tslint-disable member-ordering */
import * as R from '../typings'
import { getCurrentModelState } from '../utils/getCurrentModelState'
import { walk } from '../utils/walk'

/**
 * Effects Plugin
 *
 * Plugin for handling async actions
 */
const effectsPlugin: R.Plugin = {
  exposed: {
    // a plain object contain reducer functions, which will dispatch effect action
    effects: {},
  },

  // add effects to dispatch so that dispatch[modelName][effectName] calls an effect
  onModel(model: R.Model): void {
    if (!model.effects) {
      return
    }
    walk({
      modelName: model.name,
      prefix: model.name,
      effectsOrReducers: model.effects,
      actions: this.actions[model.name],
      dispatch: this.dispatch[model.name],
      onActionCallback: (prefix, key, actions, dispatch, effect) => {
        this.effects[`${prefix}/${key}`] = effect.bind(dispatch)
        actions[key] = this.createDispatcher(prefix, key)
        dispatch[key] = async (payload: any, meta: any) => {
          const action = actions[key](payload, meta)
          this.dispatch(action)
        }
        dispatch[key].isEffect = true
        this.effects[`${prefix}/${key}`].isEffect = true
        this.effects[`${prefix}/${key}`].isGetter = key.includes('__getters')
      },
    })
    this.dispatch[model.name].dispatch = this.dispatch
  },

  // process async/await actions
  middleware(store) {
    return next => async (action: R.Action) => {
      // async/await acts as promise middleware
      if (action.type in this.effects && !this.effects[action.type].isGetter) {
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
