import { combineModels, createModel, init } from '../src'

describe('redux:', () => {
  test('combineReducers should replace root', () => {
    const store = init({
      redux: {
        initialState: {},
        reducers: {
          a: () => 12,
          b: () => 27,
        },
        combineReducers: () => () => 42,
      },
    })
    expect(store.getState()).toBe(42)
  })
  test('should not accept invalid value as "redux.combineReducers"', () => {
    expect(() =>
      init({
        redux: {
          combineReducers: 42 as any,
        },
      }),
    ).toThrow()
  })

  test('combineReducers should replace root', () => {
    const store = init({
      redux: {
        initialState: {},
        createStore: () => ({
          getState: () => 42,
        }),
      },
    })
    expect(store.getState()).toBe(42)
  })

  test('model baseReducer should run', async () => {
    const libAction = 'fromRedux'
    const libReducer = (state = {}, action) => {
      switch (action.type) {
        case libAction:
          return {
            message: action.payload,
            ...state,
          }
        default:
          return state
      }
    }
    const chicken = createModel({
      name: 'chicken',
      state: {
        message: 'hello',
      },
      baseReducer: libReducer,
      effects: {
        async dinner() {
          this.dispatch({ type: libAction, payload: 'winner' })
        },
      },
    })
    const store = init({
      models: { chicken },
    })
    await store.dispatch.chicken.dinner()
    expect(store.getState().chicken.message).toBe('winner')
  })

  test('combinedModel baseReducer should run', async () => {
    const libAction = 'fromRedux'
    const libReducer = (state = {}, action) => {
      switch (action.type) {
        case libAction:
          return {
            dolphins: action.payload,
            sharks: action.payload,
          }
        default:
          return state
      }
    }
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
          this.dispatch({ type: libAction, payload: 1 })
        },
      },
      baseReducer: libReducer,
    })
    const store = init({
      models: { zoo },
    })
    await store.dispatch.zoo.incrementDolphinsAndSharksAsync()
    expect(store.getState().zoo.dolphins).toBe(1)
    expect(store.getState().zoo.sharks).toBe(1)
  })

  test('should allow accept empty model.reducers', () => {
    const store = init({
      models: {
        person: {
          name: 'person',
          state: 0,
        },
      },
    })
    expect(store.getState()).toEqual({ person: 0 })
  })

  test('should not accept invalid "model.baseReducer"', () => {
    expect(() =>
      init({
        models: {
          createStore: { baseReducer: 42 } as any,
        },
      }),
    ).toThrow()
  })

  test('should not accept invalid value as "redux.createStore"', () => {
    expect(() =>
      init({
        redux: {
          createStore: 42 as any,
        },
      }),
    ).toThrow()
  })
})
