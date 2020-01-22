import { createModel } from '../src/createModel'

describe('create model', () => {
  test('lifecycle.init should be effects.__init', () => {
    const model = createModel({
      state: 0,
      lifecycle: {
        init() {
          this.addOne()
        },
      },
      reducers: {
        addOne: state => state + 1,
      },
      effects: {
        async asyncAddOne() {
          await this.addBy(1)
        },
      },
    })

    expect(typeof model.effects.__init).toBe('function')
  })

  test('model.getters should be reducers.__getters', () => {
    const model = createModel({
      state: { cnt: 0 },
      getters: {
        init(state) {
          return state.cnt
        },
      },
      reducers: {
        addOne: state => state + 1,
      },
      effects: {
        async asyncAddOne() {
          await this.addBy(1)
        },
      },
    })

    expect(typeof model.reducers.__getters).toBe('function')
  })

  test('model.getters should be object', () => {
    const model = {
      state: { cnt: 0 },
      getters(state) {
        return state.cnt
      },
      reducers: {
        addOne: state => state + 1,
      },
      effects: {
        async asyncAddOne() {
          await this.addBy(1)
        },
      },
    }

    expect(() => createModel(model)).toThrow()
  })

  test('model.state should be object if model.getters exit', () => {
    const model = {
      state: 0,
      getters: {
        init(state) {
          return state
        },
      },
      reducers: {
        addOne: state => state + 1,
      },
      effects: {
        async asyncAddOne() {
          await this.addBy(1)
        },
      },
    }

    expect(() => createModel(model)).toThrow()
  })

  test('model.state should be init by model.getters if model.getters exit', () => {
    const model = {
      state: { cnt: 0 },
      getters: {
        init(state) {
          return 1
        },
      },
      reducers: {
        addOne: state => state + 1,
      },
      effects: {
        async asyncAddOne() {
          await this.addBy(1)
        },
      },
    }

    expect(createModel(model).state).toEqual({ cnt: 0, getters: { init: 1 } })
  })
})
