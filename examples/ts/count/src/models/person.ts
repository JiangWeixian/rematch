import { delay } from '../helpers'
import { createModel } from '@rematch2/core'

export type PesonState = number

export const person = createModel({
  state: 0,
  reducers: {
    increment: (state: PesonState) => state + 1,
  },
  effects: {
    async incrementAsync() {
      await delay(500)
      this.increment()
    },
  },
})
