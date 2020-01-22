import { createModel, init } from '../src'

describe('getters', () => {
  test('compute model.getters after model.state change', async () => {
    const sharks = createModel({
      state: { cnt: 0 },
      getters: {
        init(state) {
          return state.cnt
        },
      },
      reducers: {
        add: state => ({
          ...state,
          cnt: state.cnt + 1,
        }),
      },
      effects: {
        async asyncAdd() {
          this.add()
        },
      },
    })
    const store = init({
      models: { sharks },
    })
    await store.dispatch.sharks.add()
    expect(store.getState()).toEqual({
      sharks: {
        cnt: 1,
        getters: {
          init: 1,
        },
      },
    })
    await store.dispatch.sharks.asyncAdd()
    expect(store.getState()).toEqual({
      sharks: {
        cnt: 2,
        getters: {
          init: 2,
        },
      },
    })
  })
})
