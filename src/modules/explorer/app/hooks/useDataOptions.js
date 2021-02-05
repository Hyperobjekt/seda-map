import create from 'zustand'
import {
  getRegionFromLocationId,
  getSecondaryForDemographic,
  isGapDemographic
} from '../selectors'
// import { getStateFipsFromAbbr } from '../../../shared/utils/states'
import logger from '../../../logger'

/**
 * Adds any missing IDs to the locations array
 * @param {*} locations
 * @param {*} features
 * @returns {Array<GeoJsonFeature>}
 */
const getUpdatedLocations = (locations, locationIds) => {
  if (!Array.isArray(locationIds)) {
    locationIds = [locationIds]
  }
  return locationIds.reduce((locs, id) => {
    return locs.indexOf(id) > -1 ? locs : [...locs, id]
  }, locations)
}

const defaultMetric = 'avg'
const defaultSecondary = 'ses'
const defaultDemographic = 'all'
const defaultRegion = 'counties'

/**
 * Gets changes required to activate location (eg. new region)
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

let lastUpdate = null

/**
 * Returns values in the `next` object that have changed from the `previous` object
 * @param {*} next
 * @param {*} previous
 */
const getPropertyChanges = (next, previous) => {
  return Object.keys(next).reduce((obj, current) => {
    if (
      !previous ||
      !previous.hasOwnProperty(current) ||
      (previous.hasOwnProperty(current) &&
        previous[current] !== next[current])
    ) {
      // if there was no last update, then all changes are new
      if (!obj) obj = {}
      obj[current] = next[current]
    }
    return obj
  }, false)
}

/**
 * Returns values in the `next` object that are the same as the `previous` object
 * @param {*} next
 * @param {*} previous
 */
const getSameProperties = (next, previous) => {
  return Object.keys(next).reduce((obj, current) => {
    if (
      previous &&
      previous.hasOwnProperty(current) &&
      previous[current] === next[current]
    ) {
      if (!obj) obj = {}
      obj[current] = next[current]
    }
    return obj
  }, false)
}

const analyticsMiddleware = config => (set, get, api) =>
  config(
    args => {
      const newValues =
        typeof args === 'function' ? args(get()) : args
      // gets the values that have changed since the last update
      const changes = getPropertyChanges(newValues, lastUpdate)
      // checks if any values are the same as the last update (indicating side-effect)
      const same = getSameProperties(newValues, lastUpdate)
      // if there are changes that are not a side effect of another action, track them
      if (changes && !same) {
        console.log('track these changes:', changes)
      }
      if (changes) {
        console.log('state change:', changes)
        set(args)
        lastUpdate = changes
      }
    },
    get,
    api
  )

const useDataOptions = create(
  analyticsMiddleware((set, get) => ({
    metric: defaultMetric,
    demographic: defaultDemographic,
    region: defaultRegion,
    secondary: defaultSecondary,
    locations: [],
    activeLocation: null,
    loading: true,
    error: null,
    showError: false,
    setMetric: metric => set({ metric }),
    setDemographic: demographic => {
      const changes = {}
      // if gap, check that the secondary metric is available
      if (isGapDemographic(demographic)) {
        const secondaryOptions = getSecondaryForDemographic(
          demographic
        )
        // if secondary option is unavailable, switch to one that is
        if (secondaryOptions.indexOf(get().secondary) === -1)
          changes['secondary'] = secondaryOptions[0]
      }
      changes['demographic'] = demographic
      set(changes)
    },
    setRegion: region => {
      const changes = {}
      // reset demographic to all for schools
      if (region === 'schools' && get().demographic !== 'all')
        changes['demographic'] = 'all'
      // set secondary metric to free / reduced lunch for schools
      if (region === 'schools' && get().secondary !== 'frl')
        changes['secondary'] = 'frl'
      // set secondary metric to `ses` if non-schools region, and it's set to `frl`
      if (region !== 'schools' && get().secondary === 'frl')
        changes['secondary'] = 'ses'
      changes['region'] = region
      set(changes)
    },
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
    addLocations: (locationIds, setActive = true) => {
      // get activation for first feature
      const changes = getChangesForActiveLocation(
        locationIds[0],
        get().region
      )
      // set the loaded features in locations
      set(state => ({
        locations: getUpdatedLocations(
          state.locations,
          locationIds
        ),
        ...(setActive && changes)
      }))
    },
    addLocation: (locationId, setActive = true) => {
      set(state => {
        return {
          locations: getUpdatedLocations(
            state.locations,
            locationId
          ),
          ...(setActive && {
            activeLocation: locationId
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
      logger.debug('setting options from route', params)
      set({
        region: params['region'],
        metric: params['metric'],
        secondary: params['secondary'].split('+')[0],
        demographic: params['demographic']
      })
    }
  }))
)

export default useDataOptions
