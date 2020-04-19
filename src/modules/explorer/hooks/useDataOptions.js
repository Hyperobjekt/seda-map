import create from 'zustand'
import produce from 'immer'
import * as merge from 'deepmerge'

import { getFeatureProperty } from '../../../shared/selectors'
import {
  loadFeatureFromCoords,
  loadFeaturesFromRoute
} from '../../../shared/utils/tilequery'
import { getRegionFromLocationId } from '../../../shared/selectors'
import { getDataForId } from '../../scatterplot/components/ScatterplotBase/utils'
import { getLocationFromFeature } from '../../../shared/selectors/router'
import { getStateFipsFromAbbr } from '../../../shared/selectors/states'

/**
 * Returns true if the feature is in the provided locations array
 * @param {*} feature
 * @param {*} locations
 * @returns {boolean}
 */
const isFeatureInLocations = (feature, locations) => {
  const featureId = getFeatureProperty(feature, 'id')
  return (
    locations.findIndex(
      l => featureId === getFeatureProperty(l, 'id')
    ) > -1
  )
}

/**
 * Adds the route string to the feature
 * @param {*} feature
 * @returns {GeoJsonFeature}
 */
const addLocationStringToFeature = feature => {
  const locationString = getLocationFromFeature(feature)
  feature.properties['route'] = locationString
  return feature
}

/**
 * Adds any missing features to the locations array
 * @param {*} locations
 * @param {*} features
 * @returns {Array<GeoJsonFeature>}
 */
const getUpdatedLocations = (locations, features) => {
  if (!Array.isArray(features)) {
    features = [features]
  }
  return features.reduce((loc, feature) => {
    return isFeatureInLocations(feature, loc)
      ? loc
      : [...loc, addLocationStringToFeature(feature)]
  }, locations)
}

/**
 * Gets an object with all of the provided features' data
 * with the ID as the key
 * @param {Array<GeoJsonFeature} an array of features
 */
const getFeatureData = features => {
  return features.reduce((obj, feature) => {
    obj[feature.properties.id] = feature.properties
    return obj
  }, {})
}

const defaultMetric = 'avg'
const defaultSecondary = 'ses'
const defaultDemographic = 'all'
const defaultRegion = 'counties'

/**
 * Gets state changes required to activate location
 * @param {*} activeLocation
 * @param {*} currentRegion
 * @returns {object}
 */
const getChangesForActiveLocation = (
  activeLocation,
  currentRegion
) => {
  const region = getRegionFromLocationId(activeLocation)
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
  setDataLoading: dataLoading => set({ dataLoading }),
  setData: (data, region) => {
    set(
      produce(state => {
        state.data[region] = merge(state.data[region], data)
      })
    )
  },
  // adds a feature to the object containing data for hovered / selected features
  addFeatureData: featureData => {
    if (get().featureData.hasOwnProperty(featureData.id)) return
    set(state => {
      const newState = {
        featureData: {
          ...state.featureData,
          [featureData.id]: featureData
        }
      }
      return newState
    })
  },
  addLocationFromId: async (id, setActive = true) => {
    console.log('adding from id')
    const region = getRegionFromLocationId(id)
    const data = getDataForId(id, get().data[region])
    const feature = await loadFeatureFromCoords(data)

    set(state => {
      return {
        locations: getUpdatedLocations(state.locations, feature),
        featureData: {
          ...state.featureData,
          ...getFeatureData([feature])
        },
        ...(setActive && { activeLocation: id })
      }
    })
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
        featureData: {
          ...state.featureData,
          ...getFeatureData(features)
        },
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
  },
  setOptionsFromRoute: params => {
    const filters = params['filter'].split('+')
    const prefix =
      filters[0] === 'us'
        ? null
        : getStateFipsFromAbbr(filters[0])
    const largest = filters.length > 1 ? filters[1] : null
    console.log('setting from route', params, prefix, largest)
    set({
      region: params['region'],
      metric: params['metric'],
      secondary: params['secondary'],
      demographic: params['demographic'],
      filters: { prefix, largest }
    })
  }
})

const [useDataOptions] = create((set, get, api) => ({
  metric: defaultMetric,
  demographic: defaultDemographic,
  region: defaultRegion,
  secondary: defaultSecondary,
  locations: [],
  featureData: {},
  idMap: {},
  filters: {
    prefix: null,
    largest: null
  },
  dataLoading: false,
  data: { districts: {} },
  activeLocation: null,
  loading: true,
  error: null,
  showError: false,
  ...makeSetters(set, get)
}))

export default useDataOptions
