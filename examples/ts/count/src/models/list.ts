import { combineModels } from '@rematch2/core'
import { createModalModel } from '../generators/createModalModel'

export type ListState = {
  loadMoreKey?: string
}

const modal = createModalModel({
  name: 'listModalModel',
  list: () => 1,
  remove: () => 1,
})

export const list = combineModels({
  name: 'list',
  models: {
    modal,
  },
  effects: {
    async fetch() {
      this.modal.listAsync(1)
      this.modal.listAsync(1)
    },
  },
})
