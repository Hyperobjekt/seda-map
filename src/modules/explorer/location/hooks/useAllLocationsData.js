import useDataOptions from '../../app/hooks/useDataOptions'
import shallow from 'zustand/shallow'
import useStaticData from '../../../data/useStaticData'
import { getRegionFromLocationId } from '../../app/selectors'
import { useLoadSedaData } from '../../loader'
import { useMemo } from 'react'

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
  // pull regions from locations
  const regions = locations.map(locationId =>
    getRegionFromLocationId(locationId)
  )
  const uniqueRegions = [...new Set(regions)]
  // trigger loads for region data in case they haven't been loaded
  uniqueRegions.forEach(r => loadSedaData(r))
  const data = useStaticData(state => state.data)
  return useMemo(() => data && locations[0]
    ? locations.map(locationId => {
        const region = getRegionFromLocationId(locationId)
        const regionData = data[region]
        return regionData
          ? regionData.find(d => d.id === locationId)
          : null
      })
      // filter out any locations that weren't found
      .filter(l => !!l)
    : []
  , [data, locations])
}
