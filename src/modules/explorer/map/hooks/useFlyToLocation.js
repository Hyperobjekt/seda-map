import { useFlyToLatLon, useFlyToState } from '../../../map'
import { useCallback } from 'react'
import { getRegionFromLocationId } from '../../app/selectors'
import { getZoomLevelForRegion } from '../selectors'

export default function useFlyToLocation() {
  const flyToLatLon = useFlyToLatLon()
  const flyToState = useFlyToState()
  return useCallback(
    ({ id, lat, lon }) => {
      if (!id || !lat || !lon) return
      // fly to state boundaries if location is a state
      if (id.length === 2) return flyToState(id)
      // fly to the center point for other geographies
      const region = getRegionFromLocationId(id)
      const zoom = getZoomLevelForRegion(region)
      flyToLatLon(lat, lon, zoom)
    },
    [flyToLatLon, flyToState]
  )
}
