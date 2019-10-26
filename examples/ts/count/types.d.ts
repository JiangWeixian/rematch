import { init, RematchRootState, RematchDispatch } from '@rematch2/core'

declare module '@rematch2/core' {
  export type RootState = RematchRootState<typeof import('./src/models/internal')>
  export type RootDispatch = RematchDispatch<typeof import('./src/models/internal')>
}
