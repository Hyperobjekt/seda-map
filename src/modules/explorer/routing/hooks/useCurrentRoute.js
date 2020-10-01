import { useUiStore } from '../../hooks'
import { useMapStore } from '../../../map'
import {
  getViewportRoute,
  filterArrayToString
} from '../selectors'
import { useFilters } from '../../filters'
import useDataOptions from '../../hooks/useDataOptions'
import { useLocationsData } from '../../location'

/**
 * Gets the route string for the current options
 * @returns {string}
 */
export default () => {
  const view = useUiStore(state => state.view)
  const viewportRoute = useMapStore(state =>
    getViewportRoute(state.viewport)
  )
  const filters = useFilters()
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
