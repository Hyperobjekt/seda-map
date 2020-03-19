import create from 'zustand'
import produce from 'immer'
import * as merge from 'deepmerge'

import {
  getMetricById,
  getMetrics,
  getDemographicById,
  getGapById,
  getRegionById,
  getScatterplotVars,
  getMetricRangeFromVarName,
  getSizerFunctionForRegion,
  getDemographicForVarNames,
  getFeatureProperty
} from '../../../shared/selectors'
import { loadFeatureFromCoords } from '../../../shared/utils/tilequery'
import { getRegionFromFeatureId } from '../../../shared/selectors'
import {
  getDataForId,
  getFeatureForId
} from '../../scatterplot/components/ScatterplotBase/utils'
import { getValuePercentInRange } from '../../scatterplot/utils'
const defaultMetric = getMetricById('avg')
const defaultDemographic = getDemographicById('all')
const defaultRegion = getRegionById('counties')

/**
 * Getters for fetching from store
 * @param {} get
 */
const makeGetters = get => ({
  getScatterplotVars: () =>
    getScatterplotVars(
      get().region.id,
      get().metric.id,
      get().demographic.id
    ),
  getXyzTransformers: () => {
    const { xVar, yVar, zVar } = get().getScatterplotVars()
    const region = get().region.id
    const invertX = region === 'schools'
    const xRange = getMetricRangeFromVarName(xVar, region)
    const yRange = getMetricRangeFromVarName(yVar, region)
    // function that converts xValue to the % position on the scale
    const xValToPosition = val =>
      getValuePercentInRange(val, xRange, invertX)
    // function that converts yValue to the % position on the scale
    const yValToPosition = val =>
      100 - getValuePercentInRange(val, yRange)
    // function that converts z value to circle radius in px
    const dem = getDemographicForVarNames(xVar, yVar)
    const zValToSize = getSizerFunctionForRegion(region, dem)
    // return transformers
    return { xValToPosition, yValToPosition, zValToSize }
  },
  getLocationIdsForRegion: () => {
    const region = get().region
    const locations = get().locations
    return locations
      .map(f => getFeatureProperty(f, 'id'))
      .filter(id => id.length === region.idLength)
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
  }
})

const makeSetters = set => ({
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
  setLoading: loading => set({ loading }),
  setData: (data, region) => {
    set(
      produce(state => {
        state.data[region] = merge(state.data[region], data)
      })
    )
  }
})

const [useDataOptions] = create((set, get, api) => ({
  metric: defaultMetric,
  demographic: defaultDemographic,
  region: defaultRegion,
  locations: [],
  filters: [],
  data: { districts: {} },
  loading: true,
  addLocationFromId: async id => {
    const region = getRegionFromFeatureId(id)
    const data = getDataForId(id, get().data[region])
    const feature = await loadFeatureFromCoords(data)
    set(state => ({ locations: [...state.locations, feature] }))
  },
  addLocationFromChart: async location => {
    const feature = await loadFeatureFromCoords(location)
    set(state => ({ locations: [...state.locations, feature] }))
  },
  addLocationFromFeature: feature => {
    set(state => ({ locations: [...state.locations, feature] }))
  },
  ...makeGetters(get),
  ...makeSetters(set)
}))

export default useDataOptions
