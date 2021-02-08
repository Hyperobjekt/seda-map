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
import shallow from 'zustand/shallow'
/**
 * Gets the route string for the current options
 * @returns {string}
 */
export default () => {
  const [view, embedSecondary] = useUiStore(
    state => [
      state.isEmbed ? 'embed/' + state.view : state.view,
      state.embedSecondary
    ],
    shallow
  )
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
      embedSecondary
        ? state.secondary + '+secondary'
        : state.secondary,
      state.demographic,
      viewportRoute,
      getLocationsRoute(locationsData)
    ].join('/')
  )
}
