import { isModels } from '../src/utils/isModels'

describe('isModels', () => {
  test('return true when all objects', () => {
    expect(
      isModels({
        a: {},
        b: {},
      }),
    ).toBe(true)
  })

  test('return false when all no-objects', () => {
    expect(
      isModels({
        a: 2,
        b: 1,
      } as any),
    ).toBe(false)
  })
})
