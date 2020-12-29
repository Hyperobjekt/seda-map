import useDataOptions from '../../app/hooks/useDataOptions'
import shallow from 'zustand/shallow'
import useStaticData from '../../../data/useStaticData'
import { getRegionFromLocationId } from '../../app/selectors'
import { useLoadSedaData } from '../../loader'

/**
 * Provides all selected locations as an array of object data
 * @returns {[Array<LocationData>]}
 */
export default function useAllLocationsData() {
  const loadSedaData = useLoadSedaData()
  const locations = useDataOptions(
    state => state.locations,
    shallow
  )
  const regions = locations.map(locationId =>
    getRegionFromLocationId(locationId)
  )
  const uniqueRegions = [...new Set(regions)]
  const data = useStaticData(state => state.data)
  uniqueRegions.forEach(r => loadSedaData(r))
  return data
    ? locations.map(locationId => {
        const region = getRegionFromLocationId(locationId)
        const regionData = data[region]
        return regionData
          ? regionData.find(d => d.id === locationId)
          : null
      })
    : []
}
