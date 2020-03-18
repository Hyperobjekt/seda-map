import create from 'zustand'
import produce from 'immer'
import * as merge from 'deepmerge'
import { getRegionFromFeatureId } from '../../../shared/selectors'
import {
  getDataForId,
  getFeatureForId
} from '../../scatterplot/components/ScatterplotBase/utils'

const [useDataOptions] = create((set, get, api) => ({
  data: {
    districts: {}
  },
  setData: (data, region) => {
    set(
      produce(state => {
        state.data[region] = merge(state.data[region], data)
      })
    )
  },
  getDataForId: id => {
    if (!id) return {}
    const region = getRegionFromFeatureId(id)
    return getDataForId(id, get().data[region])
  },
  getFeatureForId: id => {
    if (!id) return {}
    const region = getRegionFromFeatureId(id)
    return getFeatureForId(id, get().data[region])
  },
  loading: true,
  setLoading: loading => set({ loading })
}))

export default useDataOptions
