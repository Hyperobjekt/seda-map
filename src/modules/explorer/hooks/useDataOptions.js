import create from 'zustand'
import {
  getFeatureProperty,
  getRegionFromLocationId,
} from '../selectors'
import {
  getLocationFromFeature
} from '../selectors/router'
import { getStateFipsFromAbbr } from '../../../shared/utils/states'

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


const [useDataOptions] = create((set, get) => ({
  metric: defaultMetric,
  demographic: defaultDemographic,
  region: defaultRegion,
  secondary: defaultSecondary,
  locations: [],
  filters: {
    prefix: null,
    largest: null
  },
  activeLocation: null,
  loading: true,
  error: null,
  showError: false,
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
  addLocations: (features, setActive = true) => {
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
}))

export default useDataOptions
