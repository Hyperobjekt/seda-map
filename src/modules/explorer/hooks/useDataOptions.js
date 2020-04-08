import create from 'zustand'
import produce from 'immer'
import * as merge from 'deepmerge'

import { getFeatureProperty } from '../../../shared/selectors'
import {
  loadFeatureFromCoords,
  loadFeaturesFromRoute
} from '../../../shared/utils/tilequery'
import { getRegionFromFeatureId } from '../../../shared/selectors'
import { getDataForId } from '../../scatterplot/components/ScatterplotBase/utils'

const isFeatureInLocations = (feature, locations) => {
  const featureId = getFeatureProperty(feature, 'id')
  return (
    locations.findIndex(
      l => featureId === getFeatureProperty(l, 'id')
    ) > -1
  )
}

const getUpdatedLocations = (locations, features) => {
  if (!Array.isArray(features)) {
    features = [features]
  }
  return features.reduce((loc, feature) => {
    return isFeatureInLocations(feature, loc)
      ? loc
      : [...loc, feature]
  }, locations)
}

const defaultMetric = 'avg'
const defaultSecondary = 'ses'
const defaultDemographic = 'all'
const defaultRegion = 'counties'

const getChangesForActiveLocation = (
  activeLocation,
  currentRegion
) => {
  const region = getRegionFromFeatureId(activeLocation)
  const changes = { activeLocation }
  if (region !== currentRegion) changes['region'] = region
  return changes
}

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
  setError: error => set({ error }),
  setShowError: showError => set({ showError }),
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
      locations: getUpdatedLocations(state.locations, feature),
      ...(setActive && { activeLocation: id })
    }))
  },
  addLocationsFromRoute: async (route, setActive = true) => {
    try {
      // load the features
      const features = await loadFeaturesFromRoute(route)
      if (!features || features.length === 0) return
      // get activation for first feature
      const changes = getChangesForActiveLocation(
        getFeatureProperty(features[0], 'id'),
        get().region
      )
      // set the loaded features in locations
      set(state => ({
        locations: getUpdatedLocations(
          state.locations,
          features
        ),
        ...(setActive && changes)
      }))
    } catch (err) {
      // unsuccessful load, show error
      set(state => ({
        error:
          err && err.message
            ? err.message
            : 'error loading location',
        showError: true
      }))
    }
  },
  addLocation: (feature, setActive = true) => {
    set(state => {
      return {
        locations: getUpdatedLocations(state.locations, feature),
        ...(setActive && {
          activeLocation: getFeatureProperty(feature, 'id')
        })
      }
    })
  },
  setActiveLocation: activeLocation => {
    if (!activeLocation) return set({ activeLocation })
    const changes = getChangesForActiveLocation(
      activeLocation,
      get().region
    )
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
  error: null,
  showError: false,
  ...makeSetters(set, get)
}))

export default useDataOptions
