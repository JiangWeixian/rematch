import memoize from 'memoize-one'
import * as R from '../typings'

const EMPTY_GETTERS = {}

export const createGetters = (getters: R.ModelGetters<any> = EMPTY_GETTERS) => {
  const memoizeGetters = {}
  Object.keys(getters).forEach(k => {
    memoizeGetters[k] = memoize(getters[k])
  })
  return (state: any) => {
    const result = {}
    Object.keys(memoizeGetters).forEach(k => {
      result[k] = memoizeGetters[k](state)
    })
    return result
  }
}
