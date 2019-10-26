import mergeConfig from '../src/utils/mergeConfig'

describe('mergeConfig:', () => {
  describe('initialState', () => {
    test('it should a regular config', () => {
      const config = {
        name: 'merageConfig',
        redux: {
          initialState: {
            a: 1,
          },
        },
      }
      const result = mergeConfig(config)
      expect(result.redux.initialState).toEqual(config.redux.initialState)
    })
  })

  describe('plugins', () => {
    test('should work with no additional plugins configs', () => {
      const config = {
        name: 'merageConfig',
        plugins: [],
      }
      const result = mergeConfig(config)
      expect(result.plugins).toEqual([])
    })

    test('should add new config plugins to the plugin list', () => {
      const plugin2 = {
        init: () => undefined,
        onModel: () => {
          return {}
        },
      }
      const plugin1 = {
        config: { plugins: [plugin2] },
        init: () => undefined,
        onModel: () => {
          return {}
        },
      }
      const config = {
        name: 'merageConfig',
        plugins: [plugin1],
      }
      const result = mergeConfig(config)
      expect(result.plugins).toEqual([plugin1, plugin2])
    })
  })

  describe('reducers', () => {
    test('should handle no redux reducers', () => {
      const result = mergeConfig({ redux: {}, name: 'merageConfig' })
      expect(result.redux.reducers).toEqual({})
    })
    test('should handle only config redux reducers', () => {
      const config = {
        name: 'merageConfig',
        redux: {
          reducers: {
            example: () => 1,
          },
        },
      }
      const result = mergeConfig(config)
      expect(result.redux.reducers).toEqual(config.redux.reducers)
    })

    test('should handle only plugin redux reducers', () => {
      const plugin = {
        config: {
          redux: {
            reducers: {
              example: () => 1,
            },
          },
        },
      }
      const config = {
        name: 'merageConfig',
        redux: {},
        plugins: [plugin],
      }
      const result = mergeConfig(config)
      expect(result.redux.reducers).toEqual(plugin.config.redux.reducers)
    })

    test('should merge config & plugin redux reducers', () => {
      const plugin = {
        config: {
          redux: {
            reducers: {
              example: () => 1,
            },
          },
        },
      }
      const config = {
        name: 'merageConfig',
        redux: {
          reducers: {
            sample: () => 2,
          },
        },
        plugins: [plugin],
      }
      const result = mergeConfig(config)
      expect(result.redux.reducers).toEqual({
        ...plugin.config.redux.reducers,
        ...config.redux.reducers,
      })
    })

    test('should apply additional redux enhancers', () => {
      const plugin = {
        config: {
          redux: {
            enhancers: [1, 2] as any,
          },
        },
      }
      const config = {
        name: 'merageConfig',
        redux: {
          enhancers: [3, 4] as any,
        },
        plugins: [plugin],
      }
      const result = mergeConfig(config)
      expect(result.redux.enhancers).toEqual([
        ...config.redux.enhancers,
        ...plugin.config.redux.enhancers,
      ])
    })

    test('config redux reducers should overwrite plugin reducers', () => {
      const plugin = {
        config: {
          redux: {
            reducers: {
              example: 1 as any,
              test: () => 2,
            },
          },
        },
      }
      const config = {
        name: 'merageConfig',
        redux: {
          reducers: {
            example: 2 as any,
          },
        },
        plugins: [plugin],
      }
      const result = mergeConfig(config)
      expect(result.redux.reducers).toEqual({
        ...plugin.config.redux.reducers,
        ...config.redux.reducers,
      })
    })
  })

  describe('redux', () => {
    test('should handle no redux combineReducers', () => {
      const result = mergeConfig({ name: 'mergeConfig' })
      expect(result.redux.combineReducers).toEqual(undefined)
    })
    test('should handle config redux combineReducers', () => {
      const combineReducers = s => s + 1
      const config = {
        name: 'mergeConfig',
        redux: {
          combineReducers,
        },
      }
      const result = mergeConfig(config)
      expect(result.redux.combineReducers).toEqual(combineReducers)
    })

    test('if both, plugin redux.combineReducers should take priority over config', () => {
      const pluginFn = s => s + 1
      const configFn = s => s + 2
      const plugin1 = {
        config: {
          redux: {
            combineReducers: pluginFn,
          },
        },
      }
      const config = {
        name: 'mergeConfig',
        redux: {
          combineReducers: configFn,
        },
        plugins: [plugin1],
      }
      const result = mergeConfig(config)
      expect(result.redux.combineReducers).toEqual(configFn)
    })
  })
})
