import { useMemo } from 'react'
import { useStaticData } from '../../../data'
import { getRegionFromLocationId } from '../../app/selectors'
import { useLoadSedaData } from '../../loader'

/**
 * Hook that returns locations data given an array of location IDs
 */
export default function useLocationIdsData(locations) {
  const loadSedaData = useLoadSedaData()
  const data = useStaticData(state => state.data)

  return useMemo(() => {
    // get regions for locations
    const regions = locations.map(locationId =>
      getRegionFromLocationId(locationId)
    )
    const uniqueRegions = [...new Set(regions)]
    // trigger loads for region data in case they haven't been loaded
    uniqueRegions.forEach(r => loadSedaData(r))
    return (
      locations
        .map(id => {
          const region = getRegionFromLocationId(id)
          if(!region) return null
          const regionData = data[region]
          return regionData
            ? regionData.find(d => d.id === id)
            : null
        })
        // filter out locations with no data, or locations that already exist
        .filter(
          l => !!l && !locations.find(loc => loc.id === l.id)
        )
    )
  }, [locations, data, loadSedaData])
}
