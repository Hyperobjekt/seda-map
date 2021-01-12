import useCompareStore from './useCompareStore'
import useLocationIdsData from '../../location/hooks/useLocationIdsData'

/**
 * Provides all selected locations as an array of object data
 * @returns {[Array<LocationData>]}
 */
export default function useCompareLocationsData() {
  const locations = useCompareStore(state => state.locations)
  return useLocationIdsData(locations)
}
