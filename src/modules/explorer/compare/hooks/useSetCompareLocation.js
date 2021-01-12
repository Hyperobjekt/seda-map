import { useCallback } from 'react'
import { useRegion } from '../../app/hooks'
import { getRegionFromLocationId } from '../../app/selectors'
import useCompareStore from './useCompareStore'

export default function useSetCompareLocation() {
  const [region, setRegion] = useRegion()
  const setSelectedLocation = useCompareStore(
    state => state.setSelectedLocation
  )
  return useCallback(
    locationId => {
      const locRegion = getRegionFromLocationId(locationId)
      if (region !== locRegion) setRegion(locRegion)
      setSelectedLocation(locationId)
    },
    [region, setRegion, setSelectedLocation]
  )
}
