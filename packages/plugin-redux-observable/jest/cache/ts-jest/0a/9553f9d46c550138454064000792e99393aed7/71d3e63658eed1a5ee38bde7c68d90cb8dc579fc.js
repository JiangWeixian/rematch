'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const getDispatchers_1 = require('../src/utils/getDispatchers')
const utils_1 = require('./utils')
const models = {
  sharks: utils_1.sharks,
  dolphins: utils_1.dolphins,
}
const dispatchers = getDispatchers_1.getDispatchers(models)
describe('test utils getDispatchers', () => {
  test('dispatchers has same structure as models', () => {
    expect(Object.keys(dispatchers)).toEqual(['sharks', 'dolphins'])
    expect(Object.keys(dispatchers.sharks)).toEqual(['increment', 'incrementAsync'])
    expect(Object.keys(dispatchers.dolphins)).toEqual(['increment', 'incrementAsync'])
  })
  test('value of dispatchers should be function', () => {
    Object.keys(dispatchers.sharks).forEach(key => {
      expect(typeof dispatchers.sharks[key]).toBe('function')
    })
    Object.keys(dispatchers.dolphins).forEach(key => {
      expect(typeof dispatchers.dolphins[key]).toBe('function')
    })
  })
  test('item in dispatchers has propety type', () => {
    Object.keys(dispatchers.sharks).forEach(key => {
      expect(dispatchers.sharks[key].type).toBe(`sharks/${key}`)
    })
    Object.keys(dispatchers.dolphins).forEach(key => {
      expect(dispatchers.dolphins[key].type).toBe(`dolphins/${key}`)
    })
  })
  test('dispatchers should dispatch original redux action', () => {
    expect(dispatchers.sharks.increment()).toEqual({
      type: 'sharks/increment',
      payload: undefined,
      meta: undefined,
    })
  })
})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL3FpZGFudGEvRG9jdW1lbnRzL3BlcnNvbmFsL3JlbWF0Y2gtb2JzZXJ2YWJsZS90ZXN0L2dldERpc3BhdGNoZXJzLnRlc3QudHMiLCJtYXBwaW5ncyI6Ijs7QUFBQSxnRUFBNEQ7QUFDNUQsbUNBQTBDO0FBRTFDLE1BQU0sTUFBTSxHQUFHO0lBQ2IsTUFBTSxFQUFOLGNBQU07SUFDTixRQUFRLEVBQVIsZ0JBQVE7Q0FDVCxDQUFBO0FBRUQsTUFBTSxXQUFXLEdBQUcsK0JBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUUxQyxRQUFRLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLElBQUksQ0FBQywwQ0FBMEMsRUFBRSxHQUFHLEVBQUU7UUFDcEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQTtRQUNoRSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1FBQ2hGLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7SUFDcEYsQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMseUNBQXlDLEVBQUUsR0FBRyxFQUFFO1FBQ25ELE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQzthQUM1QixPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNmLE1BQU0sQ0FBQyxPQUFPLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDekQsQ0FBQyxDQUFDLENBQUE7UUFFSixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUM7YUFDOUIsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDZixNQUFNLENBQUMsT0FBTyxXQUFXLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1FBQzNELENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxFQUFFO1FBQ2hELE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQzthQUM1QixPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNmLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLENBQUE7UUFDNUQsQ0FBQyxDQUFDLENBQUE7UUFFSixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUM7YUFDOUIsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDZixNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQyxDQUFBO1FBQ2hFLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsbURBQW1ELEVBQUUsR0FBRyxFQUFFO1FBQzdELE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUE7SUFDbkgsQ0FBQyxDQUFDLENBQUE7QUFFSixDQUFDLENBQUMsQ0FBQSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyIvVXNlcnMvcWlkYW50YS9Eb2N1bWVudHMvcGVyc29uYWwvcmVtYXRjaC1vYnNlcnZhYmxlL3Rlc3QvZ2V0RGlzcGF0Y2hlcnMudGVzdC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXREaXNwYXRjaGVycyB9IGZyb20gJy4uL3NyYy91dGlscy9nZXREaXNwYXRjaGVycydcbmltcG9ydCB7IHNoYXJrcywgZG9scGhpbnMgfSBmcm9tICcuL3V0aWxzJ1xuXG5jb25zdCBtb2RlbHMgPSB7XG4gIHNoYXJrcyxcbiAgZG9scGhpbnMsXG59XG5cbmNvbnN0IGRpc3BhdGNoZXJzID0gZ2V0RGlzcGF0Y2hlcnMobW9kZWxzKVxuXG5kZXNjcmliZSgndGVzdCB1dGlscyBnZXREaXNwYXRjaGVycycsICgpID0+IHtcbiAgdGVzdCgnZGlzcGF0Y2hlcnMgaGFzIHNhbWUgc3RydWN0dXJlIGFzIG1vZGVscycsICgpID0+IHtcbiAgICBleHBlY3QoT2JqZWN0LmtleXMoZGlzcGF0Y2hlcnMpKS50b0VxdWFsKFsnc2hhcmtzJywgJ2RvbHBoaW5zJ10pXG4gICAgZXhwZWN0KE9iamVjdC5rZXlzKGRpc3BhdGNoZXJzLnNoYXJrcykpLnRvRXF1YWwoWydpbmNyZW1lbnQnLCAnaW5jcmVtZW50QXN5bmMnXSlcbiAgICBleHBlY3QoT2JqZWN0LmtleXMoZGlzcGF0Y2hlcnMuZG9scGhpbnMpKS50b0VxdWFsKFsnaW5jcmVtZW50JywgJ2luY3JlbWVudEFzeW5jJ10pXG4gIH0pXG5cbiAgdGVzdCgndmFsdWUgb2YgZGlzcGF0Y2hlcnMgc2hvdWxkIGJlIGZ1bmN0aW9uJywgKCkgPT4ge1xuICAgIE9iamVjdC5rZXlzKGRpc3BhdGNoZXJzLnNoYXJrcylcbiAgICAgIC5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgZXhwZWN0KHR5cGVvZiBkaXNwYXRjaGVycy5zaGFya3Nba2V5XSkudG9CZSgnZnVuY3Rpb24nKVxuICAgICAgfSlcblxuICAgIE9iamVjdC5rZXlzKGRpc3BhdGNoZXJzLmRvbHBoaW5zKVxuICAgICAgLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBleHBlY3QodHlwZW9mIGRpc3BhdGNoZXJzLmRvbHBoaW5zW2tleV0pLnRvQmUoJ2Z1bmN0aW9uJylcbiAgICAgIH0pXG4gIH0pXG5cbiAgdGVzdCgnaXRlbSBpbiBkaXNwYXRjaGVycyBoYXMgcHJvcGV0eSB0eXBlJywgKCkgPT4ge1xuICAgIE9iamVjdC5rZXlzKGRpc3BhdGNoZXJzLnNoYXJrcylcbiAgICAgIC5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgZXhwZWN0KGRpc3BhdGNoZXJzLnNoYXJrc1trZXldLnR5cGUpLnRvQmUoYHNoYXJrcy8ke2tleX1gKVxuICAgICAgfSlcblxuICAgIE9iamVjdC5rZXlzKGRpc3BhdGNoZXJzLmRvbHBoaW5zKVxuICAgICAgLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBleHBlY3QoZGlzcGF0Y2hlcnMuZG9scGhpbnNba2V5XS50eXBlKS50b0JlKGBkb2xwaGlucy8ke2tleX1gKVxuICAgICAgfSlcbiAgfSlcblxuICB0ZXN0KCdkaXNwYXRjaGVycyBzaG91bGQgZGlzcGF0Y2ggb3JpZ2luYWwgcmVkdXggYWN0aW9uJywgKCkgPT4ge1xuICAgIGV4cGVjdChkaXNwYXRjaGVycy5zaGFya3MuaW5jcmVtZW50KCkpLnRvRXF1YWwoeyB0eXBlOiAnc2hhcmtzL2luY3JlbWVudCcsIHBheWxvYWQ6IHVuZGVmaW5lZCwgbWV0YTogdW5kZWZpbmVkIH0pXG4gIH0pXG5cbn0pXG4iXSwidmVyc2lvbiI6M30=
