import * as R from '../typings'

export const isModels = (
  reducers: { [key: string]: R.ModelReducers<any> } | R.ModelReducers<any>,
) => {
  const reducerKeys = Object.keys(reducers)
  return reducerKeys.some(key => typeof reducers[key] === 'object')
}
