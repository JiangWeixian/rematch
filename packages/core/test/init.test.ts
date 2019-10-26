import { combineModels, createModel, init } from '../src'

describe('init:', () => {
  test('no params should create store with state `{}`', () => {
    const store = init()

    expect(store.getState()).toEqual({})
  })

  test('should create models', () => {
    const store = init({
      models: {
        app: {
          state: 'Hello, model 1',
        },
        app2: {
          state: 'Hello, model 2',
        },
      },
    })

    expect(store.getState()).toEqual({
      app: 'Hello, model 1',
      app2: 'Hello, model 2',
    })
  })

  test('should allow both init models & model models', () => {
    const store = init({
      models: {
        app: {
          state: 'Hello, model 1',
        },
      },
    })

    store.model({
      name: 'app2',
      state: 'Hello, model 2',
      reducers: {
        set: state => state,
      },
    })

    expect(store.getState()).toEqual({
      app: 'Hello, model 1',
      app2: 'Hello, model 2',
    })
  })

  test('should throw if models are not an object', () => {
    const model = {
      name: 'app',
      state: 'Hello, world',
    }

    expect(() =>
      init({
        models: [model] as any,
      }),
    ).toThrow()
  })

  test('init() & one model created by createModel', () => {
    const store = init({
      models: {
        dolphins: createModel({
          name: 'dolphins',
          state: 0,
          reducers: {
            increment: state => state + 1,
          },
          effects: {
            async incrementAsync() {
              this.increment()
            },
          },
        }),
      },
    })

    expect(store.getState()).toEqual({
      dolphins: 0,
    })
  })

  test('init() & one model created by combinedModels', () => {
    const dolphins = createModel({
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

    const sharks = createModel({
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
    const store = init({
      models: {
        zoo: combineModels({
          name: 'zoo',
          models: {
            sharks,
            dolphins,
          },
        }),
      },
    })

    expect(store.getState()).toEqual({
      zoo: {
        dolphins: 0,
        sharks: 0,
      },
    })
  })

  test('init() & two model: combinedModels and createModel', () => {
    const dolphins = createModel({
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

    const sharks = createModel({
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

    const person = createModel({
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
    const store = init({
      models: {
        zoo: combineModels({
          name: 'zoo',
          models: {
            sharks,
            dolphins,
          },
        }),
        person,
      },
    })

    expect(store.getState()).toEqual({
      zoo: {
        dolphins: 0,
        sharks: 0,
      },
      person: 0,
    })
  })

  test('init() & one model of state type `string`', () => {
    const store = init()

    store.model({
      name: 'app',
      state: 'Hello, world',
      reducers: {
        set: state => state,
      },
    })

    expect(store.getState()).toEqual({
      app: 'Hello, world',
    })
  })

  test('init() & one model of state type `number`', () => {
    const store = init()

    store.model({
      name: 'count',
      state: 99,
      reducers: {
        set: state => state,
      },
    })

    expect(store.getState()).toEqual({
      count: 99,
    })
  })

  test('init() & one model of state is 0', () => {
    const store = init()

    store.model({
      name: 'count',
      state: 0,
      reducers: {
        set: state => state,
      },
    })

    expect(store.getState()).toEqual({
      count: 0,
    })
  })

  test('init() & one model of state type `object`', () => {
    const store = init()

    store.model({
      name: 'todos',
      state: {
        abc: {
          text: 'PRty down',
          done: true,
        },
      },
      reducers: {
        set: state => state,
      },
    })

    expect(store.getState()).toEqual({
      todos: {
        abc: {
          text: 'PRty down',
          done: true,
        },
      },
    })
  })
  test('init() & two models', () => {
    const store = init()

    store.model({
      name: 'app',
      state: 'Hello, world',
      reducers: {
        set: state => state,
      },
    })

    store.model({
      name: 'count',
      state: 99,
      reducers: {
        set: state => state,
      },
    })

    expect(store.getState()).toEqual({
      app: 'Hello, world',
      count: 99,
    })
  })

  test('init() & three models', () => {
    const store = init()

    store.model({
      name: 'app',
      state: 'Hello, world',
      reducers: {
        set: state => state,
      },
    })

    store.model({
      name: 'count',
      state: 99,
      reducers: {
        set: state => state,
      },
    })

    store.model({
      name: 'todos',
      state: {
        abc: {
          text: 'PRty down',
          done: true,
        },
      },
      reducers: {
        set: state => state,
      },
    })

    expect(store.getState()).toEqual({
      app: 'Hello, world',
      count: 99,
      todos: {
        abc: {
          text: 'PRty down',
          done: true,
        },
      },
    })
  })
  test('should not validate if production', () => {
    process.env.NODE_ENV = 'production'

    const model = {
      name: 'app',
      state: 'Hello, world',
    }

    expect(() =>
      init({
        models: [model] as any,
      }),
    ).not.toThrow()
  })
})
