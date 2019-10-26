import { createModel } from '@rematch2/core'

export const createModalModel = ({
  name,
  list,
  remove,
}: {
  name: string
  list: Function
  remove?: Function
}) => {
  return createModel({
    name,
    state: 0,
    reducers: {
      increment: state => state + 1,
    },
    effects: {
      async listAsync(payload: number, rootState: any) {
        await list()
      },
      ...(remove
        ? {
            async removeAsync() {
              await remove()
            },
          }
        : {}),
    },
  })
}
