import create from 'zustand'
import produce from 'immer'
import * as merge from 'deepmerge'

import {
  getMetricById,
  getDemographicById,
  getGapById,
  getRegionById,
  getFeatureProperty
} from '../../../shared/selectors'
import { loadFeatureFromCoords } from '../../../shared/utils/tilequery'
import { getRegionFromFeatureId } from '../../../shared/selectors'
import { getDataForId } from '../../scatterplot/components/ScatterplotBase/utils'

const defaultMetric = getMetricById('avg')
const defaultDemographic = getDemographicById('all')
const defaultRegion = getRegionById('counties')

const makeSetters = (set, get) => ({
  setMetric: metric =>
    set({
      metric:
        typeof metric === 'string'
          ? getMetricById(metric)
          : metric
    }),
  setDemographic: demographic =>
    set({
      demographic:
        typeof demographic === 'string'
          ? getDemographicById(demographic) ||
            getGapById(demographic)
          : demographic
    }),
  setRegion: region =>
    set({
      region:
        typeof region === 'string'
          ? getRegionById(region)
          : region
    }),
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
    if (region !== get().region.id)
      changes['region'] = getRegionById(region)
    set(changes)
  }
})

const [useDataOptions] = create((set, get, api) => ({
  metric: defaultMetric,
  demographic: defaultDemographic,
  region: defaultRegion,
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
