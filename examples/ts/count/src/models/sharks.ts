import { delay } from '../helpers'
import { createModel } from '@rematch2/core'

export type SharksState = number

export const sharks = createModel({
  state: 0,
  reducers: {
    increment: (state: SharksState, payload: number): SharksState => state + payload,
    setLoading: (state: SharksState, payload: boolean) => state + 1,
  },
  effects: {
    // TODO: Optional args breaks TypeScript autocomplete (e.g. payload: number = 1)
    async incrementAsync(payload: number) {
      await delay(500)
      this.setLoading(true)
      this.increment(payload || 1)
    },
  },
})
