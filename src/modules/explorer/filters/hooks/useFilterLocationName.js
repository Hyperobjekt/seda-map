import { useMemo } from 'react'
import { useLocationName } from '../../location'
import useFilterLocation from './useFilterLocation'

export default function useFilterLocationName() {
  const locationId = useFilterLocation()
  const locationName = useLocationName(locationId)
  return useMemo(() => {
    // if no location, we're showing data for the US
    if (!locationName) return 'the U.S.'
    return locationName
  }, [locationName])
}
