import validate from '../utils/validate'

/**
 * - `modelname/submodelname/effectname`, currentState is rootState[modelName][subModelName]
 * - `modelname/effectName`, currentState is rootState[modelName]
 * @param store redux.store
 * @param actionType 'modelname/submodelname/effectname' or 'modelname/effectname'
 */
export const getCurrentModelState = (rootState: object, actionType: string) => {
  validate([
    [!actionType.match(/\//), `action.type format should be 'modelNanme/subModelName?/effectName'`],
  ])
  const actions = actionType.split('/')
  if (actions.length <= 1) {
    return rootState
  } else {
    const currentState = actions.slice(0, actions.length - 1).reduce((acc, current) => {
      return acc[current]
    }, rootState)
    return currentState
  }
}
