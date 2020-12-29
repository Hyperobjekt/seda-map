import useDataOptions from '../../app/hooks/useDataOptions'
import shallow from 'zustand/shallow'
import useStaticData from '../../../data/useStaticData'

/**
 * Provides all selected locations for the current region as an array of object data
 * @returns {[Array<LocationData>]}
 */
export default function useCurrentRegionLocationsData() {
  const region = useDataOptions(state => state.region)
  const locations = useDataOptions(
    state => state.locations,
    shallow
  )
  const data = useStaticData(state => state.data)
  const regionData = data[region]
  return regionData
    ? locations.map(l => regionData.find(d => d.id === l))
    : []
}
