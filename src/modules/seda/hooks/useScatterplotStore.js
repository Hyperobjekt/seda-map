import create from 'zustand'
import produce from 'immer'

const [useScatterplotStore] = create((set, get, api) => ({
  data: {
    districts: {}
  },
  setData: (data, region) =>
    set(
      produce(state => {
        state.data[region] = data
      })
    ),
  loading: true,
  setLoading: loading => set({ loading })
}))

export default useScatterplotStore
