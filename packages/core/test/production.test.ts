describe('production:', () => {
  describe('production:cjs', () => {
    test('init is valid in common js build', () => {
      const { init } = require('../dist/cjs/rematch')
      expect(init).toBeDefined()
    })
    test('createModel is valid in common js build', () => {
      const { createModel } = require('../dist/cjs/rematch')
      expect(createModel).toBeDefined()
    })
    test('combineModels is valid in common js build', () => {
      const { combineModels } = require('../dist/cjs/rematch')
      expect(combineModels).toBeDefined()
    })
  })

  describe('production:umd', () => {
    test('init is valid in universal module build', () => {
      const rematch = require('../dist/umd/rematch')
      expect(rematch.init).toBeDefined()
    })
    test('createModel is valid in universal module build', () => {
      const rematch = require('../dist/umd/rematch.js')
      expect(rematch.createModel).toBeDefined()
    })
    test('combineModels is valid in universal module build', () => {
      const rematch = require('../dist/umd/rematch.js')
      expect(rematch.combineModels).toBeDefined()
    })
  })
})
