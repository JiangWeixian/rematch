import { delay } from '../helpers'
import { createModel } from '@rematch2/core'

export type DolphinsState = number

export const dolphins = createModel({
  state: 1,
  reducers: {
    increment: state => state + 1,
  },
  effects: {
    async incrementAsync() {
      await delay(500)
      this.increment(1)
    },
  },
})
