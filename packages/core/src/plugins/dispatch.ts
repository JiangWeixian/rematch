import * as R from '../typings'
import { isModels } from '../utils/isModels'
import validate from '../utils/validate'

/**
 * this.modelname.submodelname.reducername() will dispatch({ type: 'modelname/submodelname/reducername' })
 * ```js
 * city: {
 *   zoo: {
 *     dolphins, // reducers
 *     sharks, // reducers
 *     zoo? // reducers
 *   },
 *   person // reducers
 *   city: // reducers
 * }
 * ```
 * 1. reducer in zoo.dolphins will dispatch({ type: 'city/zoo/dolphins/reducer' })
 * 2. reduer in zoo.zoo will dispatch({ type: city/zoo/reducer })
 * 3. reducer in city.person will dispatch({ type: city/reducer })
 * 4. reducer in city.city will dispatch({ type: city/reducer })
 * @param modelName model.name(root)
 * @param prefix model.name -> model.name/submodel.name -> model.name/submodel.name/reducername
 * @param reducers model.reducers
 * ```js
 * // option1
 * reducers: {
 *   [reducerKey]: reducer
 * }
 * // option2
 * reducers: {
 *   [submodelName]: ModelReducers // or recur option2
 * }
 * ```
 * @param createDispatcher dispatchPlugin.createDispatcher
 * @param context
 */
const recurBindDispatch = (
  modelName: string,
  prefix: string,
  actions: object,
  reducers: any,
  createDispatcher: Function,
  context: any,
) => {
  const reducerKeys = Object.keys(reducers)
  const nextDispatch = {}
  let extraDispatch = {}
  if (isModels(reducers)) {
    reducerKeys.forEach(key => {
      if (prefix.endsWith(key)) {
        const nextPrefix = prefix
        extraDispatch = recurBindDispatch(
          modelName,
          nextPrefix,
          actions,
          reducers[key],
          createDispatcher,
          context,
        )
      } else {
        const nextPrefix = key === modelName ? key : `${prefix}/${key}`
        actions[key] = {}
        nextDispatch[key] = recurBindDispatch(
          modelName,
          nextPrefix,
          actions[key],
          reducers[key],
          createDispatcher,
          context,
        )
      }
    })
    return { ...nextDispatch, ...extraDispatch }
  } else {
    reducerKeys.forEach(key => {
      validate([
        [!!key.match(/\/.+\//) || !!key.match(/\//), `Invalid reducer name (${prefix}/${key})`],
        [key === 'dispatch', `Reducer can not name 'dispatch'`],
        [
          typeof reducers[key] !== 'function',
          `Invalid reducer (${prefix}/${key}). Must be a function`,
        ],
      ])
      actions[key] = createDispatcher(prefix, key)
      nextDispatch[key] = async (payload: any, meta: any) => {
        const action = await actions[key](payload, meta)
        context.dispatch(action)
      }
    })
    return nextDispatch
  }
}

/**
 * Dispatch Plugin
 *
 * generates dispatch[modelName][actionName]
 */
const dispatchPlugin: R.Plugin = {
  exposed: {
    // required as a placeholder for store.dispatch
    storeDispatch(action: R.Action, state: any) {
      console.warn('Warning: store not yet loaded')
    },

    storeGetState() {
      console.warn('Warning: store not yet loaded')
    },

    /**
     * dispatch
     *
     * both a function (dispatch) and an object (dispatch[modelName][actionName])
     * @param action R.Action
     */
    dispatch(action: R.Action) {
      return this.storeDispatch(action)
    },

    /**
     * createDispatcher
     *
     * genereates an action creator for a given model & reducer
     * @param modelName string
     * @param reducerName string
     */
    createDispatcher(modelName: string, reducerName: string) {
      return async (payload?: any, meta?: any): Promise<any> => {
        const action: R.Action = { type: `${modelName}/${reducerName}` }
        if (typeof payload !== 'undefined') {
          action.payload = payload
        }
        if (typeof meta !== 'undefined') {
          action.meta = meta
        }
        return action
      }
    },

    actions: {},
  },

  // access store.dispatch after store is created
  onStoreCreated(store: any) {
    this.storeDispatch = store.dispatch
    this.storeGetState = store.getState
    return { dispatch: this.dispatch }
  },

  // generate action creators for all model.reducers
  onModel(model: R.Model) {
    this.dispatch[model.name] = {}
    this.actions[model.name] = {}
    if (!model.reducers) {
      return
    }
    this.dispatch[model.name] = recurBindDispatch(
      model.name,
      model.name,
      this.actions[model.name],
      model.reducers,
      this.createDispatcher,
      this,
    )
  },
}

export default dispatchPlugin
