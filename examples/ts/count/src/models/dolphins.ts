import { delay } from '../helpers'
import { createModel } from '@rematch2/core'

export type DolphinsState = number

export enum Gap {
  S = 1,
  M = 2,
}

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
    more: function({ cnt }) {
      return cnt > 2
    },
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
    async incrementByEnum(payload: Gap) {
      await delay(500)
      console.log(payload)
      this.increment()
    },
  },
})
