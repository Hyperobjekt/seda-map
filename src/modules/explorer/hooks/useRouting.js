import { useEffect, useRef } from 'react'
import useDebounce from '../../../shared/hooks/useDebounce'
import {
  useAddLocationsByRoute,
  useLocationsData
} from '../hooks'
import useDataOptions from '../hooks/useDataOptions'
import useUiStore from '../hooks/useUiStore'
import {
  isEmptyRoute,
  isValidExplorerRoute,
  getParamsFromPathname,
  filterArrayToString,
  paramsToFilterArray
} from '../selectors/router'
import { useMapStore } from '../../map'
import useFilterStore from '../../filters'
import { formatNumber } from '../../../shared/utils'

/**
 * Gets a route string for locations
 * @param {*} locations
 * @returns {string}
 */
const getLocationsRoute = locations => {
  let locationsRoute = locations
    .map(l => [l.id, l.lat, l.lon].join(','))
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
const useRouterParams = () => {
  const view = useUiStore(state => state.view)
  const viewportRoute = useMapStore(state =>
    getViewportRoute(state.viewport)
  )
  const filters = useFilterStore(state => state.filters)
  const locationsData = useLocationsData()
  return useDataOptions(state =>
    [
      view,
      filterArrayToString(filters),
      state.region,
      state.metric,
      state.secondary,
      state.demographic,
      viewportRoute
      // getLocationsRoute(locationsData)
    ].join('/')
  )
}

/**
 * Hook that enables routing for the explorer.  Routes are in the following format:
 * /#/{view}/{filters}/{region}/{metric}/{secondary}/{demographic}/{zoom}/{lat}/{lon}
 */
export default () => {
  // track if initial route has loaded
  const isLoaded = useRef(false)
  // get the route params based on current view
  const route = useRouterParams()
  // function to set options based on a route string
  const setDataOptions = useDataOptions(
    state => state.setOptionsFromRoute
  )
  const addLocationsFromRoute = useAddLocationsByRoute()

  const setViewOptions = useUiStore(
    state => state.setViewFromRoute
  )
  const setMapOptions = useMapStore(
    state => state.setViewportFromRoute
  )

  const setFilters = useFilterStore(state => state.setFilters)

  const setFilterOptions = params => {
    const filters = paramsToFilterArray(params)
    console.log('filter params', params, filters)
    setFilters(filters)
  }

  // debounce the route so it updates every 1 second max
  const debouncedRoute = useDebounce(route, 500)

  // update the hash when debounced route changes
  useEffect(() => {
    // only change the hash if the initial route has loaded
    if (isLoaded.current) {
      window.location.hash = '#/' + debouncedRoute
    }
  }, [debouncedRoute])

  // load the route when the application mounts
  useEffect(() => {
    async function loadRoute() {
      isLoaded.current = true
      const path = window.location.hash
      if (!isEmptyRoute(path) && isValidExplorerRoute(path)) {
        const params = getParamsFromPathname(path)
        setDataOptions(params)
        setViewOptions(params)
        setMapOptions(params)
        setFilterOptions(params)
        if (params.locations)
          await addLocationsFromRoute(params.locations, false)
      }
    }
    loadRoute()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
