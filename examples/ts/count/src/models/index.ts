import { Models } from '@rematch2/core'
import { dolphins } from './dolphins'
import { sharks } from './sharks'
import { zoo } from './zoo'
import { city } from './city'

export const models: RootModel = { dolphins, sharks, zoo, city }

export interface RootModel extends Models {
  dolphins: typeof dolphins
  sharks: typeof sharks
  zoo: typeof zoo
  city: typeof city
}
