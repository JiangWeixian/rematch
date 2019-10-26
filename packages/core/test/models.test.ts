import { combineModels, createModel } from '../src'
import * as R from '../src/typings'

describe('models：', () => {
  test('createModel', () => {
    const beforeCreate = {
      name: 'model1',
      state: 0,
      baseReducer: (state, action) => state,
      reducers: {
        increment: state => state + 1,
      },
      effects: {
        async incrementAsync() {
          this.increment()
        },
      },
    }
    const model1 = createModel(beforeCreate)

    expect(model1).toEqual(beforeCreate)
  })

  describe('combinedModels', () => {
    let dolphins: R.ModelConfig
    let sharks: R.ModelConfig
    let person: R.ModelConfig
    let extraReducers: R.ModelReducers<any>
    let extraEffects: R.ModelEffects<any>
    beforeEach(() => {
      dolphins = createModel({
        name: 'dolpins',
        state: 0,
        reducers: {
          increment: state => state + 1,
        },
        effects: {
          async incrementAsync() {
            this.increment()
          },
        },
      })

      sharks = createModel({
        name: 'sharks',
        state: 0,
        reducers: {
          increment: (state, payload: number) => state + payload,
        },
        effects: {
          async incrementAsync(payload: number) {
            this.increment(payload || 1)
          },
        },
      })

      person = createModel({
        state: 0,
        reducers: {
          increment: state => state + 1,
        },
        effects: {
          async incrementAsync() {
            this.increment()
          },
        },
      })

      extraReducers = {
        incrementDolphinsAndSharks: state => {
          return {
            dolphins: state.dolphins + 1,
            sharks: state.sharks + 1,
          }
        },
      }

      extraEffects = {
        async incrementDolphinsAndSharksAsync() {
          this.dolphins.increment()
          this.sharks.increment(1)
        },
      }
    })

    test('baseReducer from single model will be ignore', () => {
      const lion = createModel({
        name: 'lion',
        state: 0,
        baseReducer: (state, action) => state,
        reducers: {
          increment: state => state + 1,
        },
        effects: {
          async incrementAsync() {
            this.increment()
          },
        },
      })

      expect(() => {
        combineModels({
          name: 'zoo',
          models: {
            lion,
            sharks,
          },
        })
      }).toThrow()
    })

    test('combine two single models', () => {
      const zoo = combineModels({
        name: 'zoo',
        models: {
          dolphins,
          sharks,
        },
      })

      expect(zoo).toEqual({
        name: 'zoo',
        state: {
          dolphins: 0,
          sharks: 0,
        },
        reducers: {
          dolphins: dolphins.reducers,
          sharks: sharks.reducers,
        },
        effects: {
          dolphins: dolphins.effects,
          sharks: sharks.effects,
        },
      })
    })

    test('combine models & extra reducers and effects', () => {
      const zoo = combineModels({
        name: 'zoo',
        models: {
          dolphins,
          sharks,
        },
        reducers: extraReducers,
        effects: extraEffects,
      })

      expect(zoo).toEqual({
        name: 'zoo',
        state: {
          dolphins: 0,
          sharks: 0,
        },
        reducers: {
          dolphins: dolphins.reducers,
          sharks: sharks.reducers,
          zoo: extraReducers,
        },
        effects: {
          dolphins: dolphins.effects,
          sharks: sharks.effects,
          zoo: extraEffects,
        },
      })
    })

    test('combine single models & combined model without extra reducers and effects', () => {
      const zoo = combineModels({
        name: 'zoo',
        models: {
          dolphins,
          sharks,
        },
      })

      const cityReducers = {
        incrementCity: state => {
          return {
            person: state.person + 1,
            zoo: {
              dolphins: state.zoo.dolphins + 1,
              sharks: state.zoo.sharks + 1,
            },
          }
        },
      }

      const cityEffects = {
        async incrementCityAsync() {
          this.person.increment()
          this.zoo.incrementDolphinsAndSharksAsync()
        },
      }

      const city = combineModels({
        name: 'city',
        models: {
          zoo,
          person,
        },
        reducers: cityReducers,
        effects: cityEffects,
      })

      expect(city).toEqual({
        name: 'city',
        state: {
          person: 0,
          zoo: {
            dolphins: 0,
            sharks: 0,
          },
        },
        reducers: {
          zoo: {
            dolphins: dolphins.reducers,
            sharks: sharks.reducers,
          },
          person: person.reducers,
          city: cityReducers,
        },
        effects: {
          zoo: {
            dolphins: dolphins.effects,
            sharks: sharks.effects,
          },
          person: person.effects,
          city: cityEffects,
        },
      })
    })

    test('combine single models & combined model with extra reducers and effects', () => {
      const zoo = combineModels({
        name: 'zoo',
        models: {
          dolphins,
          sharks,
        },
        reducers: extraReducers,
        effects: extraEffects,
      })

      const cityReducers = {
        incrementCity: state => {
          return {
            person: state.person + 1,
            zoo: {
              dolphins: state.zoo.dolphins + 1,
              sharks: state.zoo.sharks + 1,
            },
          }
        },
      }

      const cityEffects = {
        async incrementCityAsync() {
          this.person.increment()
          this.zoo.incrementDolphinsAndSharksAsync()
        },
      }

      const city = combineModels({
        name: 'city',
        models: {
          zoo,
          person,
        },
        reducers: cityReducers,
        effects: cityEffects,
      })

      expect(city).toEqual({
        name: 'city',
        state: {
          zoo: {
            dolphins: 0,
            sharks: 0,
          },
          person: 0,
        },
        reducers: {
          zoo: {
            dolphins: dolphins.reducers,
            sharks: sharks.reducers,
            zoo: extraReducers,
          },
          person: person.reducers,
          city: cityReducers,
        },
        effects: {
          zoo: {
            dolphins: dolphins.effects,
            sharks: sharks.effects,
            zoo: extraEffects,
          },
          person: person.effects,
          city: cityEffects,
        },
      })
    })
  })
})
