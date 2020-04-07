import create from 'zustand'
import produce from 'immer'
import * as merge from 'deepmerge'

import { getFeatureProperty } from '../../../shared/selectors'
import { loadFeatureFromCoords } from '../../../shared/utils/tilequery'
import { getRegionFromFeatureId } from '../../../shared/selectors'
import { getDataForId } from '../../scatterplot/components/ScatterplotBase/utils'

const defaultMetric = 'avg'
const defaultSecondary = 'ses'
const defaultDemographic = 'all'
const defaultRegion = 'counties'

const makeSetters = (set, get) => ({
  setMetric: metric => set({ metric }),
  setDemographic: demographic => set({ demographic }),
  setRegion: region => set({ region }),
  setSecondary: secondary => set({ secondary }),
  setLocations: locations => set({ locations }),
  setFilters: filters => set({ filters }),
  setFilter: (type, value) =>
    set(state => ({
      filters: {
        ...state.filters,
        [type]: value
      }
    })),
  setLoading: loading => set({ loading }),
  setData: (data, region) => {
    set(
      produce(state => {
        state.data[region] = merge(state.data[region], data)
      })
    )
  },
  addLocationFromId: async (id, setActive = true) => {
    const region = getRegionFromFeatureId(id)
    const data = getDataForId(id, get().data[region])
    const feature = await loadFeatureFromCoords(data)
    set(state => ({
      locations: [...state.locations, feature],
      ...(setActive && { activeLocation: id })
    }))
  },
  addLocation: (feature, setActive = true) => {
    set(state => ({
      locations: [...state.locations, feature],
      ...(setActive && {
        activeLocation: getFeatureProperty(feature, 'id')
      })
    }))
  },
  setActiveLocation: activeLocation => {
    if (!activeLocation) return set({ activeLocation })
    const region = getRegionFromFeatureId(activeLocation)
    const changes = { activeLocation }
    if (region !== get().region) changes['region'] = region
    set(changes)
  }
})

const [useDataOptions] = create((set, get, api) => ({
  metric: defaultMetric,
  demographic: defaultDemographic,
  region: defaultRegion,
  secondary: defaultSecondary,
  locations: [],
  filters: {
    prefix: null,
    largest: null
  },
  data: { districts: {} },
  activeLocation: null,
  loading: true,
  ...makeSetters(set, get)
}))

export default useDataOptions
