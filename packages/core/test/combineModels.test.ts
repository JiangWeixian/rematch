import { combineModels } from '../src/combineModels'
import { createModel } from '../src/createModel'

const dolphins = createModel({
  state: {
    cnt: 0,
  },
  lifecycle: {
    init() {
      this.incrementAsync()
    },
  },
  getters: {
    more({ cnt }) {
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
      this.increment()
    },
  },
})

const sharks = createModel({
  state: {
    cnt: 0,
  },
  lifecycle: {
    init() {
      this.incrementAsync()
    },
  },
  getters: {
    more({ cnt }) {
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
      this.increment()
    },
  },
})

describe('combine models', () => {
  test('should normalize child models reducers and effects', () => {
    const zoo = combineModels({
      name: 'zoo',
      models: {
        sharks,
        dolphins,
      },
    })
    expect(zoo.effects.dolphins).toEqual(dolphins.effects)
    expect(zoo.effects.sharks).toEqual(sharks.effects)
    expect(zoo.reducers.dolphins).toEqual(dolphins.reducers)
    expect(zoo.reducers.sharks).toEqual(sharks.reducers)
  })

  test('combined model effects and reducers should collected in model[name]', () => {
    const zoo = combineModels({
      name: 'zoo',
      models: {
        sharks,
        dolphins,
      },
      reducers: {
        incrementDolphinsAndSharks: state => {
          return {
            dolphins: {
              ...state.dolphins,
              cnt: state.dolphins.cnt + 1,
            },
            sharks: {
              ...state.sharks,
              cnt: state.sharks.cnt + 1,
            },
          }
        },
      },
      effects: {
        async incrementDolphinsAndSharksAsync() {
          this.dolphins.increment()
          this.sharks.increment(1)
        },
      },
    })
    expect(!!zoo.effects['zoo']['incrementDolphinsAndSharksAsync']).toBe(true)
    expect(!!zoo.reducers['zoo']['incrementDolphinsAndSharks']).toBe(true)
  })
})
