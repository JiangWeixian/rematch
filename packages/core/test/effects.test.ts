import { combineModels, createModel, init } from '../src'

describe('effects:', () => {
  test('should create an action', () => {
    const count = {
      state: 0,
      effects: {
        add: () => 1,
      },
    }

    const store = init({
      models: { count },
    })

    expect(typeof store.dispatch.count.add).toBe('function')
  })
  test('first param should be payload', async () => {
    let value = 1

    const count = {
      state: 0,
      effects: {
        add(payload: number) {
          value += payload
        },
      },
    }

    const store = init({
      models: { count },
    })

    await store.dispatch({ type: 'count/add', payload: 4 })

    expect(value).toBe(5)
  })

  test('second param should contain root state', async () => {
    let secondParam

    const count = {
      state: 7,
      reducers: {
        add: (s: number, p: number) => s + p,
      },
      effects: {
        async makeCall(payload: number, state: { count: number }) {
          secondParam = state
        },
      },
    }

    const store = init({
      models: { count },
    })

    await store.dispatch.count.makeCall(2)

    expect(secondParam).toEqual({ count: 7 })
  })

  test('third param should contain current state', async () => {
    let thirdParam
    let secondParam
    const sharks = {
      state: 7,
      reducers: {
        add: (s: number, p: number) => s + p,
      },
      effects: {
        async makeCall(payload: number, rootState: { sharks: number }) {
          secondParam = rootState
        },
      },
    }

    const dolphins = {
      state: 7,
      reducers: {
        add: (s: number, p: number) => s + p,
      },
      effects: {
        async makeCall(payload: number, rootState: { dolphins: number }, currentState) {
          thirdParam = currentState
        },
      },
    }

    const store = init({
      models: { sharks, dolphins },
    })

    await store.dispatch.sharks.makeCall(2)
    expect(secondParam).toEqual({ sharks: 7, dolphins: 7 })
    await store.dispatch.dolphins.makeCall(2)
    expect(thirdParam).toEqual(7)
  })

  // test('should create an effect', () => {
  //   const store = init()

  //   store.model({
  //     name: 'example',
  //     state: 0,
  //     effects: {
  //       add: () => 1
  //     },
  //   })

  //   expect(effects['example/add']()).toBe(1)
  // })

  test('should be able to trigger another action', async () => {
    const example = {
      state: 0,
      reducers: {
        addOne: (state: number) => state + 1,
      },
      effects: {
        async asyncAddOneArrow() {
          await this.addOne()
        },
      },
    }

    const store = init({
      models: { example },
    })

    await store.dispatch.example.asyncAddOneArrow()

    expect(store.getState()).toEqual({
      example: 1,
    })
  })

  // currently no solution for arrow functions as they are often transpiled by Babel or Typescript
  // there is no clear way to detect arrow functions
  // xtest('should be able trigger a local reducer using arrow functions and `this`', async () => {
  //   const { model, init, dispatch } = require('../src')
  //   const store = init()
  //
  //   model({
  //     name: 'example',
  //     state: 0,
  //     reducers: {
  //       addOne: (state) => state + 1,
  //     },
  //     effects: {
  //       asyncAddOneArrow: async () => {
  //         await this.addOne()
  //       }
  //     }
  //   })
  //
  //   await dispatch.example.asyncAddOneArrow()
  //
  //   expect(store.getState()).toEqual({
  //     example: 1,
  //   })
  // })

  test('should be able trigger a local reducer using functions and `this`', async () => {
    const example = {
      state: 0,
      reducers: {
        addOne: (state: number) => state + 1,
      },
      effects: {
        async asyncAddOne() {
          await this.addOne()
        },
      },
    }

    const store = init({
      models: { example },
    })

    await store.dispatch.example.asyncAddOne()

    expect(store.getState()).toEqual({
      example: 1,
    })
  })

  test('should be able trigger a local reducer using object function shorthand and `this`', async () => {
    const example = {
      state: 0,
      reducers: {
        addOne: (state: number) => state + 1,
      },
      effects: {
        async asyncAddOne() {
          await this.addOne()
        },
      },
    }

    const store = init({
      models: { example },
    })

    await store.dispatch.example.asyncAddOne()

    expect(store.getState()).toEqual({
      example: 1,
    })
  })

  test('should be able to trigger another action with a value', async () => {
    const example = {
      state: 2,
      reducers: {
        addBy: (state: number, payload: number) => state + payload,
      },
      effects: {
        async asyncAddBy(value: number) {
          await this.addBy(value)
        },
      },
    }

    const store = init({
      models: { example },
    })

    await store.dispatch.example.asyncAddBy(5)

    expect(store.getState()).toEqual({
      example: 7,
    })
  })

  test('should be able to trigger another action w/ an object value', async () => {
    const example = {
      state: 3,
      reducers: {
        addBy: (state: number, payload: { value: number }) => state + payload.value,
      },
      effects: {
        async asyncAddBy(payload: { value: number }) {
          await this.addBy(payload)
        },
      },
    }

    const store = init({
      models: { example },
    })

    await store.dispatch.example.asyncAddBy({ value: 6 })

    expect(store.getState()).toEqual({
      example: 9,
    })
  })

  test('should be able to trigger another action w/ another action', async () => {
    const example = {
      name: 'example',
      state: 0,
      reducers: {
        addOne: (state: number) => {
          return state + 1
        },
      },
      effects: {
        async asyncAddOne() {
          await this.addOne()
          return true
        },
        async asyncCallAddOne() {
          await this.asyncAddOne()
          return true
        },
      },
    }

    const store = init({
      models: { example },
    })

    await store.dispatch.example.asyncCallAddOne()

    expect(store.getState()).toEqual({
      example: 1,
    })
  })

  test('should be able to trigger another action w/ multiple actions', async () => {
    const example = {
      state: 0,
      reducers: {
        addBy: (state: number, payload: number) => state + payload,
      },
      effects: {
        async asyncAddOne() {
          await this.addBy(1)
        },
        async asyncAddThree() {
          await this.addBy(3)
        },
        async asyncAddSome() {
          await this.asyncAddThree()
          await this.asyncAddOne()
          await this.asyncAddOne()
        },
      },
    }

    const store = init({
      models: { example },
    })

    await store.dispatch.example.asyncAddSome()

    await setTimeout(() => {
      expect(store.getState()).toEqual({
        example: 5,
      })
    })
  })

  test('should throw if the effect name is invalid', () => {
    const store = init()

    expect(() =>
      store.model({
        name: 'a',
        state: 42,
        reducers: {},
        effects: {
          'invalid/effect': () => 43,
        },
      }),
    ).toThrow()
  })

  test('should throw if the effect name is dispatch', () => {
    const store = init()

    expect(() =>
      store.model({
        name: 'a',
        state: 42,
        reducers: {},
        effects: {
          dispatch: () => 43,
        },
      }),
    ).toThrow()
  })

  test('should throw if the effect is not a function', () => {
    const store = init()

    expect(() =>
      store.model({
        name: 'a',
        state: 42,
        reducers: {},
        effects: {
          is43: 43,
        } as any,
      }),
    ).toThrow()
  })

  test('should work with combinedModel from two single models', async () => {
    const dolphins = createModel({
      name: 'dolpins',
      state: 0,
      reducers: {
        increment: state => state + 1,
      },
      effects: {
        async incrementAsync() {
          await this.increment()
        },
      },
    })

    const sharks = createModel({
      name: 'sharks',
      state: 0,
      reducers: {
        increment: (state, payload: number) => state + payload,
      },
      effects: {
        async incrementAsync() {
          await this.increment()
        },
      },
    })

    const zoo = combineModels({
      name: 'zoo',
      models: {
        sharks,
        dolphins,
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
          this.dolphins.increment()
          this.sharks.increment(1)
        },
      },
    })

    const store = init({
      models: {
        zoo,
      },
    })

    expect(store.getState()).toEqual({
      zoo: {
        dolphins: 0,
        sharks: 0,
      },
    })

    await store.dispatch.zoo.dolphins.incrementAsync()
    expect(store.getState()).toEqual({
      zoo: {
        dolphins: 1,
        sharks: 0,
      },
    })
    await store.dispatch.zoo.incrementDolphinsAndSharksAsync()
    expect(store.getState()).toEqual({
      zoo: {
        dolphins: 2,
        sharks: 1,
      },
    })
  })

  test('should work with a nested combinedModel', async () => {
    const dolphins = createModel({
      name: 'dolpins',
      state: 0,
      reducers: {
        increment: state => state + 1,
      },
      effects: {
        async incrementAsync() {
          await this.increment()
        },
      },
    })

    const person = createModel({
      name: 'person',
      state: 0,
      reducers: {
        increment: (state, payload: number) => state + payload,
      },
    })

    const sharks = createModel({
      name: 'sharks',
      state: 0,
      reducers: {
        increment: (state, payload: number) => state + payload,
      },
      effects: {
        async incrementAsync() {
          await this.increment()
        },
      },
    })

    const zoo = combineModels({
      name: 'zoo',
      models: {
        sharks,
        dolphins,
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
          this.dolphins.increment()
          this.sharks.increment(1)
        },
      },
    })

    const city = combineModels({
      name: 'city',
      models: {
        zoo,
        person,
      },
      reducers: {
        incrementCity: state => {
          return {
            person: state.person + 1,
            zoo: {
              dolphins: state.zoo.dolphins + 1,
              sharks: state.zoo.sharks + 1,
            },
          }
        },
      },
      effects: {
        async incrementCityAsync() {
          this.person.increment(1)
          this.zoo.incrementDolphinsAndSharksAsync()
        },
      },
    })

    const store = init({
      models: {
        city,
      },
    })

    expect(store.getState()).toEqual({
      city: {
        zoo: {
          dolphins: 0,
          sharks: 0,
        },
        person: 0,
      },
    })

    await store.dispatch.city.zoo.dolphins.incrementAsync()
    expect(store.getState()).toEqual({
      city: {
        zoo: {
          dolphins: 1,
          sharks: 0,
        },
        person: 0,
      },
    })
    await store.dispatch.city.zoo.incrementDolphinsAndSharksAsync()
    await store.dispatch.city.incrementCityAsync()
    expect(store.getState()).toEqual({
      city: {
        zoo: {
          dolphins: 3,
          sharks: 2,
        },
        person: 1,
      },
    })
  })

  test('should appear as an action for devtools', async () => {
    const actions: string[] = []

    const count = createModel({
      state: 0,
      reducers: {
        addOne(state) {
          return state + 1
        },
      },
      effects: {
        async addOneAsync() {
          this.addOne()
        },
      },
    })

    const store = init({
      models: {
        count,
      },
      redux: {
        middlewares: [
          () => next => action => {
            actions.push(action.type)
            return next(action)
          },
        ],
      },
    })

    await store.dispatch.count.addOneAsync()
    expect(actions).toEqual(['count/addOneAsync', 'count/addOne'])
  })

  test('effects as a function is not allow', () => {
    const example = {
      name: 'example',
      state: 0,
      reducers: {
        addOne: (state: number) => state + 1,
      },
      effects: dispatch => ({
        async asyncAddOneArrow() {
          await dispatch.example.addOne()
        },
      }),
    } as any

    expect(() => {
      init({
        models: { example },
      })
    }).toThrow()
  })

  test('should not validate effect if production', () => {
    process.env.NODE_ENV = 'production'

    const count = {
      state: 0,
      effects: {
        'add/invalid': (state: number) => state + 1,
      },
    }

    expect(() =>
      init({
        models: { count },
      }),
    ).not.toThrow()
  })
})
