describe('deprecate:', () => {
  const module = require('../src/utils/deprecate')
  const deprecate = module.default

  it('should call console.warn', () => {
    const warn = jest.spyOn(console, 'warn')
    const cache = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    deprecate('warning')
    expect(warn).toHaveBeenCalled()

    warn.mockReset()
    warn.mockRestore()
    process.env.NODE_ENV = cache
  })
})
