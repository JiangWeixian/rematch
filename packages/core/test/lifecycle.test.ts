import { combineModels, createModel, init } from '../src'

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

describe('lifecycle', () => {
  describe('init', () => {
    test('sync init model.state should work', async () => {
      const sharks = createModel({
        state: 0,
        lifecycle: {
          init() {
            this.add()
          },
        },
        reducers: {
          add: state => state + 1,
        },
      })
      const store = init({
        models: { sharks },
      })
      await delay(0)
      expect(store.getState()).toEqual({
        sharks: 1,
      })
    })
    test('async init model.state should work', async () => {
      const sharks = createModel({
        state: 0,
        lifecycle: {
          init() {
            this.asyncAdd()
          },
        },
        reducers: {
          add: state => state + 1,
        },
        effects: {
          async asyncAdd() {
            await delay(500)
            this.add()
          },
        },
      })
      const store = init({
        models: { sharks },
      })
      await delay(1000)
      expect(store.getState()).toEqual({
        sharks: 1,
      })
    })
    test('init should work on combined models', async () => {
      const sharks = createModel({
        state: 0,
        lifecycle: {
          init() {
            this.add()
          },
        },
        reducers: {
          add: state => state + 1,
        },
      })
      const dolphins = createModel({
        state: 0,
        lifecycle: {
          init() {
            this.add()
          },
        },
        reducers: {
          add: state => state + 1,
        },
      })
      const zoo = combineModels({
        name: 'zoo',
        models: {
          sharks,
          dolphins,
        },
      })
      const store = init({
        models: { zoo },
      })
      await delay(0)
      expect(store.getState()).toEqual({
        zoo: {
          sharks: 1,
          dolphins: 1,
        },
      })
    })
  })
})
