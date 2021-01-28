import { useEffect, useRef } from 'react'
import useDebounce from '../../../../shared/hooks/useDebounce'
import useDataOptions from '../../app/hooks/useDataOptions'
import useUiStore from '../../app/hooks/useUiStore'
import {
  isEmptyRoute,
  isValidExplorerRoute,
  getParamsFromPathname,
  paramsToFilterArray
} from '../selectors'
import { useMapStore } from '../../../map'
import useFilterStore from '../../../filters'
import useAddLocationsByRoute from './useAddLocationsByRoute'
import useCurrentRoute from './useCurrentRoute'

export const supportsLocalStorage = () => {
  var mod = 'test'
  try {
    localStorage.setItem(mod, mod)
    localStorage.removeItem(mod)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Hook that enables routing for the explorer.  Routes are in the following format:
 * /#/{view}/{filters}/{region}/{metric}/{secondary}/{demographic}/{zoom}/{lat}/{lon}
 */
export default () => {
  // track if initial route has loaded
  const isLoaded = useRef(false)
  // get the route params based on current view
  const route = useCurrentRoute()
  // function to set options based on a route string
  const [setDataOptions, setDataOptionsLoading] = useDataOptions(
    state => [state.setOptionsFromRoute, state.setLoading]
  )
  const addLocationsFromRoute = useAddLocationsByRoute()

  const setViewOptions = useUiStore(
    state => state.setViewFromRoute
  )
  const setViewport = useMapStore(state => state.setViewport)

  const setFilters = useFilterStore(state => state.setFilters)

  const setFilterOptions = params => {
    const filters = paramsToFilterArray(params)
    setFilters(filters)
  }

  // debounce the route so it updates every 1 second max
  const debouncedRoute = useDebounce(route, 500)

  const setViewportFromRoute = params => {
    const viewport = {
      zoom: params.zoom,
      latitude: params.lat,
      longitude: params.lon
    }
    setViewport(viewport)
  }

  // update the hash when debounced route changes
  useEffect(() => {
    // only change the hash if the initial route has loaded
    if (isLoaded.current) {
      window.location.hash = '#/' + debouncedRoute

      const params = debouncedRoute.split("/")

      if(params[0] !== 'embed' && supportsLocalStorage) {
        localStorage.setItem('view', params[0])
        localStorage.setItem('region', params[2])
        localStorage.setItem('metric', params[3])
        localStorage.setItem('demographic', params[5])
      }
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
        setViewportFromRoute(params)
        setFilterOptions(params)
        if (params.locations)
          await addLocationsFromRoute(params.locations, false)
      }else {
        if(supportsLocalStorage && localStorage.getItem('demographic')) {
          setDataOptions({
            region: localStorage.getItem('region') ? localStorage.getItem('region') : 'counties',
            metric: localStorage.getItem('metric') ? localStorage.getItem('metric') : 'avg',
            demographic: localStorage.getItem('demographic'),
            secondary: 'ses'
          })
          setViewOptions({
            view: localStorage.getItem('view') ? localStorage.getItem('view') : 'map',
            secondary: 'ses'
          })
        }
      }
      setDataOptionsLoading(false)
    }
    loadRoute()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
