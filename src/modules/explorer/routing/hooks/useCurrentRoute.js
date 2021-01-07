import { useUiStore } from '../../app/hooks'
import { useMapStore } from '../../../map'
import {
  getViewportRoute,
  filterArrayToString,
  getLocationsRoute
} from '../selectors'
import { useFilters } from '../../filters'
import useDataOptions from '../../app/hooks/useDataOptions'
import { useAllLocationsData } from '../../location'

/**
 * Gets the route string for the current options
 * @returns {string}
 */
export default () => {
  const view = useUiStore(state => state.isEmbed ? 'embed/' + state.view : state.view)
  const viewportRoute = useMapStore(state =>
    getViewportRoute(state.viewport)
  )
  const filters = useFilters()
  const locationsData = useAllLocationsData()
  return useDataOptions(state =>
    [
      view,
      filterArrayToString(filters),
      state.region,
      state.metric,
      state.secondary,
      state.demographic,
      viewportRoute,
      getLocationsRoute(locationsData)
    ].join('/')
  )
}
