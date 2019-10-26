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
  reducers: {
    incrementDolphinsAndSharks: state => {
      return {
        dolphins: state.dolphins + 1,
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
