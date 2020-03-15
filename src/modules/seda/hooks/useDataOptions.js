import create from 'zustand'
import {
  getMetricById,
  getMetrics,
  getDemographicById,
  getGapById,
  getRegionById,
  getScatterplotVars
} from '../../../shared/selectors'
import { loadFeatureFromCoords } from '../../../shared/utils/tilequery'

const defaultMetric = getMetricById('avg')
const defaultDemographic = getDemographicById('all')
const defaultRegion = getRegionById('districts')

const [useDataOptions] = create((set, get, api) => ({
  metric: defaultMetric,
  setMetric: metric =>
    set({
      metric:
        typeof metric === 'string'
          ? getMetricById(metric)
          : metric
    }),
  demographic: defaultDemographic,
  setDemographic: demographic =>
    set({
      demographic:
        typeof demographic === 'string'
          ? getDemographicById(demographic) ||
            getGapById(demographic)
          : demographic
    }),
  region: defaultRegion,
  setRegion: region =>
    set({
      region:
        typeof region === 'string'
          ? getRegionById(region)
          : region
    }),
  locations: [],
  setLocations: locations => set({ locations }),
  addLocationFromChart: async location => {
    const feature = await loadFeatureFromCoords(location)
    console.log('GOT FEATURE', feature)
    set(state => ({ locations: [...state.locations, feature] }))
  },
  filters: [],
  setFilters: filters => set({ filters }),
  getScatterplotVars: () =>
    getScatterplotVars(
      get().region.id,
      get().metric.id,
      get().demographic.id
    )
}))

export default useDataOptions
