import { delay } from '../helpers'
import { createModel, RootState } from '@rematch2/core'

export type DolphinsState = number

export const dolphins = createModel({
  state: 0,
  reducers: {
    increment: (state: DolphinsState) => state + 1,
  },
  effects: {
    async incrementAsync(payload, rootstate: RootState) {
      await delay(500)
      this.increment()
    },
  },
})
