import { dolphins } from './dolphins'
import { sharks } from './sharks'
import { combineModels } from '@rematch2/core'
import { delay } from '../helpers'

export const zoo = combineModels({
  name: 'zoo',
  models: {
    dolphins,
    sharks,
  },
  getters: {
    bigger: function(state) {
      return state.dolphins.cnt > 5
    },
  },
  reducers: {
    incrementDolphinsAndSharks: state => {
      return {
        dolphins: {
          ...state.dolphins,
          cnt: state.dolphins.cnt + 1,
        },
        sharks: state.sharks + 1,
      }
    },
  },
  effects: {
    async incrementDolphinsAndSharksAsync() {
      await delay(500)
      this.dolphins.increment()
      this.sharks.increment(1)
    },
  },
})
