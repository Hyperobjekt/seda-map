import create from 'zustand'
import {
  getRegionFromLocationId,
  getSecondaryForDemographic,
  isGapDemographic
} from '../selectors'
// import { getStateFipsFromAbbr } from '../../../shared/utils/states'
import logger from '../../../logger'
import analyticsMiddleware from '../middleware/analyticsMiddleware'

const getChangesForRegionUpdate = (
  region,
  { secondary, demographic }
) => {
  const changes = {}
  // reset demographic to all for schools
  if (region === 'schools' && demographic !== 'all')
    changes['demographic'] = 'all'
  // set secondary metric to free / reduced lunch for schools
  if (region === 'schools' && secondary !== 'frl')
    changes['secondary'] = 'frl'
  // set secondary metric to `ses` if non-schools region, and it's set to `frl`
  if (region !== 'schools' && secondary === 'frl')
    changes['secondary'] = 'ses'
  changes['region'] = region
  return changes
}

const getChangesForDemographicUpdate = (
  demographic,
  { secondary }
) => {
  const changes = {}
  // if gap, check that the secondary metric is available
  if (isGapDemographic(demographic)) {
    const secondaryOptions = getSecondaryForDemographic(
      demographic
    )
    // if secondary option is unavailable, switch to one that is
    if (secondaryOptions.indexOf(secondary) === -1)
      changes['secondary'] = secondaryOptions[0]
  }
  changes['demographic'] = demographic
  return changes
}

/**
 * Gets changes required to activate location (eg. new region)
 * @param {*} activeLocation
 * @param {*} currentRegion
 * @returns {object}
 */
const getChangesForActiveLocationUpdate = (
  activeLocation,
  currentRegion
) => {
  const region = getRegionFromLocationId(activeLocation)
  const changes = { activeLocation }
  if (region !== currentRegion) changes['region'] = region
  return changes
}

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
      const changes = getChangesForDemographicUpdate(
        demographic,
        { secondary: get().secondary }
      )
      set(changes)
    },
    setRegion: region => {
      const changes = getChangesForRegionUpdate(region, {
        demographic: get().demographic,
        secondary: get().secondary
      })
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
      const changes = getChangesForActiveLocationUpdate(
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
      const changes = getChangesForActiveLocationUpdate(
        activeLocation,
        get().region
      )
      set(changes)
    },
    setOptionsFromRoute: params => {
      logger.debug('setting options from route', params)
      const routeValues = {
        region: params['region'],
        metric: params['metric'],
        secondary: params['secondary'].split('+')[0],
        demographic: params['demographic']
      }
      const regionChanges = getChangesForRegionUpdate(
        routeValues.region,
        routeValues
      )
      const mergedChanges = { ...routeValues, ...regionChanges }
      const demographicChanges = getChangesForDemographicUpdate(
        mergedChanges.demographic,
        mergedChanges
      )
      set({ ...mergedChanges, ...demographicChanges })
    }
  }))
)

export default useDataOptions
