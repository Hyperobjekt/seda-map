import { useCallback } from 'react'
import { useFlyToLatLon } from '../../../map'
import { getPropFromHit } from '../selectors'
import { useFlyToLocation } from '../../map'

/**
 * Returns a callback function that accepts a search hit and activates the location
 */
export default function useFlyToSearchHit() {
  const flyToLocation = useFlyToLocation()
  const flyToLatLon = useFlyToLatLon()
  return useCallback(
    hit => {
      const id = getPropFromHit(hit, 'id')
      const lat = getPropFromHit(hit, 'lat')
      const lon = getPropFromHit(hit, 'lon')
      // no locaton id, assume hit is a city and zoom to it
      if (!id) return lat && lon && flyToLatLon(lat, lon, 12)
      flyToLocation({ id, lat, lon })
    },
    [flyToLatLon, flyToLocation]
  )
}
