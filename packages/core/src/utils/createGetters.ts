import { createSelector } from 'reselect'
import * as R from '../typings'

const EMPTY_GETTERS = {}

export const createGetters = (getters: R.ModelGetters<any> = EMPTY_GETTERS) => {
  const memoizeGetters = {}
  Object.keys(getters).forEach(k => {
    memoizeGetters[k] = createSelector(
      getters[k],
      input => input,
    )
  })
  return (state: any) => {
    const result = {}
    Object.keys(memoizeGetters).forEach(k => {
      result[k] = memoizeGetters[k](state)
    })
    return result
  }
}
