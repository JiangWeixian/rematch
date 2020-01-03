import { delay } from '../helpers'
import { createModel } from '@rematch2/core'

export type DolphinsState = number

export const dolphins = createModel({
  state: {
    cnt: 0,
  },
  lifecycle: {
    init() {
      this.incrementAsync()
    },
  },
  getters: {
    bigger: function(state) {
      return state.cnt > 0
    }
  },
  reducers: {
    increment: state => ({
      ...state,
      cnt: state.cnt + 1,
    }),
  },
  effects: {
    async incrementAsync() {
      await delay(500)
      this.increment()
    },
  },
})
