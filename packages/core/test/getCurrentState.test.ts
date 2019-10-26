import { getCurrentModelState } from '../src/utils/getCurrentModelState'

const rootState = {
  city: {
    zoo: {
      dolphins: 0,
      sharks: 0,
    },
    person: 0,
  },
}

describe('getCurrentState', () => {
  test(`should get rootState.city by 'city/xxx'`, () => {
    const currentState = getCurrentModelState(rootState, 'city/xxx')

    expect(currentState).toEqual(rootState.city)
  })

  test(`should get rootState.city.person by 'city/person/xx'`, () => {
    const currentState = getCurrentModelState(rootState, 'city/person/xxx')

    expect(currentState).toEqual(rootState.city.person)
  })

  test(`should get rootState.city.zoo.sharks by 'city/zoo/sharks/xx'`, () => {
    const currentState = getCurrentModelState(rootState, 'city/zoo/sharks/xx')

    expect(currentState).toEqual(rootState.city.zoo.sharks)
  })

  test(`should throw if action.type is 'city'`, () => {
    expect(() => getCurrentModelState(rootState, 'city')).toThrow()
  })
})
