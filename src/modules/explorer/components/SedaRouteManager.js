import { useEffect, useRef } from 'react'
import useDebounce from '../../../shared/hooks/useDebounce'
import {
  useRouterParams,
  useAddLocationsByRoute
} from '../hooks'
import useDataOptions from '../hooks/useDataOptions'
import useUiStore from '../hooks/useUiStore'
import {
  isEmptyRoute,
  isValidExplorerRoute,
  getParamsFromPathname
} from '../selectors/router'
import { useMapStore } from '../../map'
import useFilterStore from '../../filters'
import { getStateFipsFromAbbr } from '../../../shared/utils/states'

const paramsToFilterArray = params => {
  // handle legacy filter value (2 letter state)
  if (
    params.filter &&
    params.filter.length === 2 &&
    params.filter !== 'us'
  ) {
    const id = getStateFipsFromAbbr(params.filter)
    return [['startsWith', 'id', id]]
  }
}

const filterArrayToString = filters => {}

const SedaRouteManager = props => {
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
    console.log('filter params', params)
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

  // this component doesn't render anything
  return null
}

export default SedaRouteManager
