import * as Redux from 'redux'

import * as R from './typings'
import { isModels } from './utils/isModels'

const composeEnhancersWithDevtools = (devtoolOptions: R.DevtoolOptions = {}): any => {
  const { disabled, ...options } = devtoolOptions
  /* istanbul ignore next */
  return !disabled && typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(options)
    : Redux.compose
}

/**
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
 * - dolphins and sharks, person will create in else block
 * - zoo(same name with parentKey), will create in else block
 * - city(same name with model.name), will filter, create outside of this function
 * then,
 * 1. redux.combinereducers(dolphins and sharks)
 * 2. combined step1-reducer-func with zoo-reducer-function
 * 3.
 * @param modelName model.name
 * @param prefix model.name -> model.name/submodel.name -> model.name/submodel.name/reducername, name for redux.model
 * @param modelState initial state
 * @param reducers model.reducers,
 * @param combineReducers redux.combineReducers
 */
const recurCreateModelReducer = (
  modelName: string,
  prefix: string,
  modelState: any,
  reducers: any,
  getters: any,
  combineReducers: Function,
): Function => {
  const rootReducers = {}
  const extraReducers = {}
  let isCombined = false
  if (isModels(reducers)) {
    Object.keys(reducers)
      .filter(key => key !== modelName)
      .forEach(key => {
        const nextPrefix = `${prefix}/${key}`
        isCombined = isCombined ? isCombined : prefix.endsWith(key)
        if (prefix.endsWith(key)) {
          Object.keys(reducers[key]).forEach(reducerName => {
            extraReducers[`${prefix}/${reducerName}`] = reducers[key][reducerName]
          })
        } else {
          rootReducers[key] = recurCreateModelReducer(
            modelName,
            nextPrefix,
            modelState[key],
            reducers[key],
            getters[key],
            combineReducers,
          )
        }
      })
    const combinedReducers = combineReducers(rootReducers)
    if (!isCombined) {
      return combinedReducers
    } else {
      return (state: any = modelState, action: R.Action) => {
        if (typeof extraReducers[action.type] === 'function') {
          return extraReducers[action.type](state, action.payload, action.meta)
        }
        return combinedReducers(state, action)
      }
    }
  } else {
    Object.keys(reducers).forEach(key => {
      const nextPrefix = `${prefix}/${key}`
      rootReducers[nextPrefix] = reducers[key]
    })
    return (state: any = modelState, action: R.Action) => {
      console.warn(getters, action)
      if (typeof rootReducers[action.type] === 'function') {
        const nextState = rootReducers[action.type](state, action.payload, action.meta)
        return typeof getters !== 'function'
          ? nextState
          : {
              ...nextState,
              getters: getters(nextState),
            }
      }
      return typeof getters !== 'function'
        ? state
        : {
            ...state,
            getters: getters(state),
          }
    }
  }
}

export default function({ redux, models }: { redux: R.ConfigRedux; models: R.Model[] }) {
  const combineReducers = redux.combineReducers || Redux.combineReducers
  const createStore: Redux.StoreCreator = redux.createStore || Redux.createStore
  const initialState: any = typeof redux.initialState !== 'undefined' ? redux.initialState : {}

  this.reducers = redux.reducers

  // combine models to generate reducers
  this.mergeReducers = (nextReducers: R.ModelReducers = {}) => {
    // merge new reducers with existing reducers
    this.reducers = { ...this.reducers, ...nextReducers }
    if (!Object.keys(this.reducers).length) {
      // no reducers, just return state
      return (state: any) => state
    }
    return combineReducers(this.reducers)
  }

  this.createModelReducer = (model: R.Model) => {
    const modelBaseReducer = model.baseReducer
    const modelReducer = recurCreateModelReducer(
      model.name,
      model.name,
      model.state,
      model.reducers || {},
      model.getters || {},
      combineReducers,
    )
    const selfReducers = {}
    const selfGetters = model.getters?.[model.name]
    if (model.reducers[model.name]) {
      Object.keys(model.reducers[model.name]).forEach(key => {
        selfReducers[`${model.name}/${key}`] = model.reducers[model.name][key]
      })
    }
    const combinedReducer = (state: any = model.state, action: R.Action) => {
      let nextState
      if (selfReducers && typeof selfReducers[action.type] === 'function') {
        nextState = selfReducers[action.type](state, action.payload, action.meta)
        return !selfGetters
          ? nextState
          : {
              ...nextState,
              getters: selfGetters?.(nextState),
            }
      }
      nextState = modelReducer(state, action)
      return !selfGetters
        ? nextState
        : {
            ...nextState,
            getters: selfGetters?.(nextState),
          }
    }

    this.reducers[model.name] = !modelBaseReducer
      ? combinedReducer
      : (state: any, action: R.Action) => combinedReducer(modelBaseReducer(state, action), action)
  }
  // initialize model reducers
  for (const model of models) {
    this.createModelReducer(model)
  }

  this.createRootReducer = (rootReducers: R.RootReducers = {}): Redux.Reducer<any, R.Action> => {
    const mergedReducers: Redux.Reducer<any> = this.mergeReducers()
    if (Object.keys(rootReducers).length) {
      return (state, action) => {
        const rootReducerAction = rootReducers[action.type]
        if (rootReducers[action.type]) {
          return mergedReducers(rootReducerAction(state, action), action)
        }
        return mergedReducers(state, action)
      }
    }
    return mergedReducers
  }

  const rootReducer = this.createRootReducer(redux.rootReducers)

  const middlewares = Redux.applyMiddleware(...redux.middlewares)
  const enhancers = composeEnhancersWithDevtools(redux.devtoolOptions)(
    ...redux.enhancers,
    middlewares,
  )

  this.store = createStore(rootReducer, initialState, enhancers)

  return this
}
