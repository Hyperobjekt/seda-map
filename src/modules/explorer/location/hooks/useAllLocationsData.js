import useDataOptions from '../../app/hooks/useDataOptions'
import shallow from 'zustand/shallow'
import useLocationIdsData from './useLocationIdsData'

/**
 * Provides all selected locations as an array of object data
 * @returns {[Array<LocationData>]}
 */
export default function useAllLocationsData() {
  const locations = useDataOptions(
    state => state.locations,
    shallow
  )
  return useLocationIdsData(locations)
}
