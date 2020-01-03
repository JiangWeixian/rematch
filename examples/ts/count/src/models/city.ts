import { zoo } from './zoo'
import { person } from './person'
import { combineModels } from '@rematch2/core'
import { delay } from '../helpers'

export const city = combineModels({
  name: 'city',
  models: {
    zoo,
    person,
  },
  reducers: {
    incrementCity: state => {
      return {
        ...state,
        person: state.person + 1,
        zoo: {
          dolphins: {
            ...state.zoo.dolphins,
            cnt: state.zoo.dolphins.cnt + 1
          },
          sharks: state.zoo.sharks + 1,
        },
      }
    },
  },
  effects: {
    async incrementCityAsync(payload: void) {
      await delay(500)
      this.person.increment()
      this.zoo.incrementDolphinsAndSharksAsync()
    },
  },
})
