import { RematchEpic, ofType } from '@rematch2/redux-observable'
import { mapTo } from 'rxjs/operators'
import { RootState, Dependencies } from 'src/store'

export const sharkEpics: RematchEpic<RootState, Dependencies> = (
  action$,
  state$,
  { dispatchers },
) => {
  return action$.pipe(
    ofType(dispatchers.dolphins.increment, dispatchers.dolphins.incrementAsync),
    mapTo(dispatchers.sharks.increment(1)),
  )
}
