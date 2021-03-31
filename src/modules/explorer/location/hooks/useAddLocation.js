import { useCallback } from 'react'
import { useUiStore } from '../../app/hooks'
import useDataOptions from '../../app/hooks/useDataOptions'
import { getBreakawayLink } from '../../sharing/selectors'

/**
 * Provides a function for adding location (GeoJSON features) to
 * the selected locations list
 * @returns {function}
 */
export default () => {
  const addLocation = useDataOptions(state => state.addLocation)
  const isEmbed = useUiStore(state => state.isEmbed)
  return useCallback(
    (locationId, ...args) => {
      if (isEmbed) {
        // open new tab with same settings, without 'embed' mode or '+secondary' flag
        window.open(getBreakawayLink())
      }
      addLocation(locationId, ...args)
    },
    [addLocation, isEmbed]
  )
}
