import PluginFactory from '../src/pluginFactory'
import * as R from '../src/typings'
import mergeConfig from '../src/utils/mergeConfig'

describe('buildPlugins:', () => {
  test('should not create a plugin with invalid "onModel"', () => {
    const pluginFactory = PluginFactory(mergeConfig({ name: 'pluginFactory' }))
    const plugin1 = {
      onModel: {},
    } as R.Plugin
    expect(() => pluginFactory.create(plugin1)).toThrow()
  })

  test('should not create a plugin with invalid "middleware"', () => {
    const pluginFactory = PluginFactory(mergeConfig({ name: 'pluginFactory' }))
    const plugin1 = {
      middleware: {},
    } as R.Plugin
    expect(() => pluginFactory.create(plugin1)).toThrow()
  })

  test('should not create a plugin with invalid "onStoreCreated"', () => {
    const pluginFactory = PluginFactory(mergeConfig({ name: 'pluginFactory' }))
    const plugin1 = {
      onStoreCreated: {},
    } as R.Plugin
    expect(() => pluginFactory.create(plugin1)).toThrow()
  })
})
