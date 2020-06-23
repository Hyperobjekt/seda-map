import shallow from 'zustand/shallow'
import useDataOptions from './useDataOptions'
import useUiStore from './useUiStore'
import {
  getFeatureProperty,
  getSizesForRegion,
  getRegionFromLocationId,
  isGapDemographic
} from '../selectors'
import { getFiltersLang } from '../selectors/lang'
import { getDataForId } from '../utils'
import {
  getStateName,
  getStateAbbr
} from '../../../shared/utils/states'
import { useCallback } from 'react'
import { formatNumber } from '../../../shared/utils'
import { useMapStore } from '../../map'
import { getVarNames } from '../selectors/data'
import useScatterplotStore from '../components/scatterplot/store'

/**
 * Provides the current values for metric, demographic, and region
 * @returns {[string, string, string]} [metricId, demographicId, regionId]
 */
export const useActiveOptionIds = () => {
  return useDataOptions(
    state => [state.metric, state.demographic, state.region],
    shallow
  )
}

/**
 * Provides the current metric id and setter
 * @returns {[string, function]} [metricId, setMetric]
 */
export const useMetric = () => {
  return useDataOptions(
    state => [state.metric, state.setMetric],
    shallow
  )
}

/**
 * Provides the secondary metric id and setter
 * @returns {[string, function]} [metricId, setMetric]
 */
export const useSecondary = () => {
  return useDataOptions(
    state => [state.secondary, state.setSecondary],
    shallow
  )
}

/**
 * Provides the current demographic id and setter
 * @returns {[string, function]} [demographicId, setDemographic]
 */
export const useDemographic = () => {
  return useDataOptions(
    state => [state.demographic, state.setDemographic],
    shallow
  )
}

/**
 * Provides the type of demographic currently active
 * @returns {string} `gap` or `single`
 */
export const useDemographicType = () => {
  return useDataOptions(state =>
    isGapDemographic(state.demographic) ? 'gap' : 'single'
  )
}

/**
 * Provides the current region id and setter
 * @returns {[string, function]} [regionId, setRegion]
 */
export const useRegion = () => {
  return useDataOptions(
    state => [state.region, state.setRegion],
    shallow
  )
}

/**
 * Provides the filter size options for the current region
 * @returns {Array<number>}
 */
export const useRegionFilterSizes = () => {
  return useDataOptions(
    state => getSizesForRegion(state.region),
    shallow
  )
}

/**
 * Provides the id of the hovered location and setter
 * @returns {[string, function]} [ hoveredId, setHovered ]
 */
export const useHovered = () => {
  return useUiStore(
    state => [state.hovered, state.setHovered],
    shallow
  )
}

/**
 * Provides an object of current filters and setters
 * @returns {[{prefix, largest}, function, function]} [ filters, setFilters, setSingleFilter ]
 */
export const useFilters = () => {
  return useDataOptions(
    state => [state.filters, state.setFilters, state.setFilter],
    shallow
  )
}

/**
 * Provides a human readable string for the current filter selections
 * @returns {string}
 */
export const useActiveFilterLang = () => {
  return useDataOptions(state => {
    const filters = state.filters
    const region = state.region
    return getFiltersLang(filters, region)
  })
}

/**
 * User Interface
 * ---------
 * Interactions with store for user interface control
 */

/**
 * Pulls condensed on/off value and setter
 * @returns {[boolean, Function]} [ isCondensed, toggleCondensed ]
 */
export const useCondensed = () =>
  useUiStore(
    state => [state.condensed, state.toggleCondensed],
    shallow
  )

/**
 * Provides boolean and setter that determines if
 * markers should show for the hovered location.
 * Markers include map outline, scatterplot dot outline,
 * and map legend tick.
 * @returns {[boolean, Function]} [ showMarkers, setShowMarkers ]
 */
export const useMarkersVisibility = () => {
  return useUiStore(
    state => [state.showMarkers, state.setShowMarkers],
    shallow
  )
}

/**
 * Provides preview chart visible value and toggle function
 * @returns {[boolean, Function]} [ showChart, toggleChart ]
 */
export const useChartVisible = () => {
  return useUiStore(
    state => [state.showChart, state.toggleChart],
    shallow
  )
}

/**
 * Provides site menu visible value and toggle function
 * @returns {[boolean, Function]}  [ showMenu, toggleMenu ]
 */
export const useMenuVisibility = () => {
  return useUiStore(
    state => [state.showMenu, state.toggleMenu],
    shallow
  )
}

/**
 * Provides help panel visible value and toggle function
 * @returns {[boolean, Function]}  [ showHelp, toggleHelp ]
 */
export const useHelpVisibility = () => {
  return useUiStore(
    state => [state.showHelp, state.toggleHelp],
    shallow
  )
}

/**
 * Provides link dialog visible value and toggle function
 * @returns {[boolean, Function]} [ showLinkDialog, toggleLinkDialog ]
 */
export const useLinkDialogVisibility = () => {
  return useUiStore(
    state => [state.showLinkDialog, state.toggleLinkDialog],
    shallow
  )
}

/**
 * Provides embed dialog visible value and toggle function
 * @returns {[boolean, Function]} [ showEmbedDialog, toggleEmbedDialog ]
 */
export const useEmbedDialogVisibility = () => {
  return useUiStore(
    state => [state.showEmbedDialog, state.toggleEmbedDialog],
    shallow
  )
}

/**
 * Provides the currently active filter selection panel value
 * ("prefix" or "largest", null for no panel) and setter function
 * @returns [string, function]
 */
export const useActiveFilterSelection = () => {
  return useUiStore(
    state => [state.filterPanel, state.setFilterPanel],
    shallow
  )
}

/**
 * Provides the currently active selection panel value
 * ('metric', 'region', 'demographic', 'filter', 'location',
 * or null for no panel) and setter function
 * @returns [string, function]
 */
export const useActiveSelection = () => {
  return useUiStore(
    state => [state.selection, state.setSelection],
    shallow
  )
}

/**
 * Value and setter for current view ("map", "chart", or "split")
 * @returns [string, function]
 */
export const useActiveView = () => {
  return useUiStore(
    state => [state.view, state.setView],
    shallow
  )
}

/**
 * Tooltip
 * ---------
 * Interactions with data store for tooltip
 */

/**
 * Provides tooltip visible value and setter function
 * @returns {[boolean, Function]} [ showTooltip, setShowTooltip ]
 */
export const useTooltipVisibility = () => {
  return useUiStore(
    state => [state.showTooltip, state.setShowTooltip],
    shallow
  )
}

/**
 * Provides the screen coordinates of the tooltip and setter function
 * @returns {[[number, number], Function]} [ [x, y], setCoords ]
 */
export const useTooltipCoords = () => {
  return useUiStore(
    state => [state.coords, state.setCoords],
    shallow
  )
}

/**
 * Scatterplot
 * ---------
 * Interactions with data store for scatterplot
 */

/**
 * Provides x, y, z scatterplot variables for current data options
 * @returns {[string, string, string]} [xVar, yVar, zVar]
 */
export const useScatterplotVars = (type = 'chart') => {
  return useDataOptions(
    state =>
      getVarNames(
        state.region,
        state.metric,
        state.secondary,
        state.demographic,
        type
      ),
    shallow
  )
}

/**
 * Provides x, y, z scatterplot variables for current data options
 * @returns {[string, string, string]} [xVar, yVar, zVar]
 */
export const useScatterplotGapVars = () => {
  return useDataOptions(
    state =>
      getVarNames(
        state.region,
        state.metric,
        state.secondary,
        state.demographic,
        'chart'
      ),
    shallow
  )
}

/**
 * Provides map vars for current state
 * @returns {[string, string]} [secondaryVar, choroplethVar]
 */
export const useMapVars = () => {
  return useDataOptions(
    state =>
      getVarNames(
        state.region,
        state.metric,
        state.secondary,
        state.demographic,
        'map'
      ),
    shallow
  )
}

/**
 * Locations
 * ---------
 * Interactions with data store for locations
 */

/**
 * Grabs an array of features for locations and a setter from the store
 * @returns {[Array<Feature>, Function]>}
 */
export const useLocations = () =>
  useDataOptions(
    state => [state.locations, state.setLocations],
    shallow
  )

/**
 * Provides all current locations as an array of object data
 * @returns {[Array<LocationData>]}
 */
export const useLocationsData = () => {
  const region = useDataOptions(state => state.region)
  const locations = useDataOptions(
    state => state.locations,
    shallow
  )
  const featureData = useDataOptions(
    state => state.featureData,
    shallow
  )
  const scatterplotData = useScatterplotStore(
    state => state.data
  )
  return locations.map(l => ({
    ...getDataForId(
      getFeatureProperty(l, 'id'),
      scatterplotData[region],
      featureData
    ),
    ...l.properties
  }))
}

/**
 * Grabs the active location ID and setter
 * @returns {[string, Function]}
 */
export const useActiveLocation = () =>
  useDataOptions(
    state => [state.activeLocation, state.setActiveLocation],
    shallow
  )

/**
 * Pulls an object containing all of the data for the active locations
 * @returns {LocationData} LocationData object
 */
export const useActiveLocationData = () => {
  const id = useDataOptions(state => state.activeLocation)
  return useLocationData(id)
}

/**
 * Pulls an object containing the GeoJSON feature for the active location
 * @returns {GeojsonFeature} LocationFeature object
 */
export const useActiveLocationFeature = () => {
  return useDataOptions(state => {
    const id = state.activeLocation
    const locations = state.locations
    return id
      ? locations.find(l => getFeatureProperty(l, 'id') === id)
      : null
  })
}

/**
 * Provides count of current locations
 * @returns {number}
 */
export const useLocationCount = () => {
  return useDataOptions(state => state.locations.length)
}

/**
 * Provides data from the store for the given ID
 * @param {string} id
 * @returns {LocationData} LocationData object
 */
export const useLocationData = id => {
  const featureData = useDataOptions(
    state => state.featureData,
    shallow
  )
  const scatterplotData = useScatterplotStore(
    state => state.data
  )
  if (!id) return null
  const region = getRegionFromLocationId(id)
  return getDataForId(id, scatterplotData[region], featureData)
}

/**
 * Provides the index of the location based on region type,
 * used for location markers
 * @param {*} id
 * @returns {number}
 */
export const useLocationNumber = id => {
  return useDataOptions(state => {
    const index = state.locations
      .filter(
        l => getFeatureProperty(l, 'id').length === id.length
      )
      .findIndex(l => getFeatureProperty(l, 'id') === id)
    return index + 1
  })
}

/**
 * Provides a function for adding location (GeoJSON features) to
 * the selected locations list
 * @returns {function}
 */
export const useAddLocation = () => {
  return useDataOptions(state => state.addLocation)
}

/**
 * Provides a function for adding location (id strings) to
 * the selected locations list
 * @returns {function}
 */
export const useAddLocationById = () => {
  return useDataOptions(state => state.addLocationFromId)
}

export const useAddLocationsByRoute = () => {
  return useDataOptions(state => state.addLocationsFromRoute)
}

/**
 * Provides a function for removing locations from
 * the selected locations list
 * @returns {function}
 */
export const useRemoveLocation = () => {
  const [locations, setLocations] = useLocations()
  return useCallback(
    location => {
      const id =
        typeof location === 'string'
          ? location
          : location && typeof location === 'object'
          ? getFeatureProperty(location, 'id')
          : null
      if (!id)
        throw new Error('tried to remove invalid location')
      const newLocations = locations.filter(
        l => getFeatureProperty(l, 'id') !== id
      )
      setLocations(newLocations)
    },
    [locations, setLocations]
  )
}

/**
 * Provides name for the given id
 * @param {string} id
 * @returns {string}
 */
export const useNameForId = id => {
  return useDataOptions(state => {
    if (!id) return ''
    const region = getRegionFromLocationId(id)
    switch (region) {
      case 'states':
        return getStateName(id)
      default:
        return getDataForId(
          id,
          state.data[region],
          state.featureData
        )['name']
    }
  })
}

/**
 * Routes
 * ---------
 * Interactions with data store for routing
 */

/**
 * Gets a route string for filters
 * @param {*} filters
 * @returns {string}
 */
const getFilterRoute = filters => {
  let route = filters.prefix
    ? getStateAbbr(filters.prefix).toLowerCase()
    : 'us'
  if (filters.largest) {
    route += '+' + filters.largest
  }
  return route
}

/**
 * Gets a route string for locations
 * @param {*} locations
 * @returns {string}
 */
const getLocationsRoute = locations => {
  let locationsRoute = locations
    .map(l => l.properties.route)
    .join('+')
  return locationsRoute
}

/**
 * Gets a route string for viewport
 * @param {*} viewport
 * @returns {string}
 */
const getViewportRoute = viewport => {
  return [
    formatNumber(viewport.zoom),
    formatNumber(viewport.latitude),
    formatNumber(viewport.longitude)
  ].join('/')
}

/**
 * Gets the route string for the current options
 * @returns {string}
 */
export const useRouterParams = () => {
  const view = useUiStore(state => state.view)
  const viewportRoute = useMapStore(state =>
    getViewportRoute(state.viewport)
  )
  return useDataOptions(state =>
    [
      view,
      getFilterRoute(state.filters),
      state.region,
      state.metric,
      state.secondary,
      state.demographic,
      viewportRoute,
      getLocationsRoute(state.locations)
    ].join('/')
  )
}

/**
 * Error Hooks
 * ---
 */

export const useError = () => {
  return useDataOptions(
    state => [state.error, state.setError],
    shallow
  )
}

/**
 * Provides site menu visible value and toggle function
 * @returns {[boolean, Function]}  [ showMenu, toggleMenu ]
 */
export const useErrorVisibility = () => {
  return useDataOptions(
    state => [state.showError, state.setShowError],
    shallow
  )
}
