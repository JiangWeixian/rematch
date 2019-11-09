import {
  combineEpics,
  createEpicMiddleware,
  Epic,
  ofType as rdxOfType,
  EpicMiddleware,
} from 'redux-observable'
import { Plugin, Models, Action } from '@rematch2/core'

export const isActionOf = (dispatcher: () => Action) => {
  return (value: { type: string; payload: any; meta: any }, index: number) => {
    const action = dispatcher()
    return value && action.type && action.type === value.type
  }
}

export const ofType = (...dispatchers: (() => Action)[]) => {
  const types = dispatchers
    .map(dispatcher => {
      const action = dispatcher()
      return action.type
    })
    .filter(type => !!type)
  return rdxOfType(...types)
}

const createRematchObservable = ({
  epics,
  models,
}: {
  epics: { [key: string]: Epic }
  models: Models
}): Plugin => {
  const epic = combineEpics(...Object.values(epics))
  let epicMiddleware: EpicMiddleware<any, any, any, any>
  return {
    middleware(store) {
      epicMiddleware = createEpicMiddleware({ dependencies: { dispatchers: this.actions } })
      return epicMiddleware(store)
    },
    onStoreCreated() {
      epicMiddleware.run(epic)
    },
  }
}

export default createRematchObservable
