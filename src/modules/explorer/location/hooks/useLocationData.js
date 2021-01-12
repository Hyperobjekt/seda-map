import useStaticData from '../../../data/useStaticData'
import { getRegionFromLocationId } from '../../app/selectors'
import { useLoadSedaData } from '../../loader'
import { getLocationNameParts } from '../selectors'

/**
 * Provides data from the store for the given ID
 * @param {string} id
 * @returns {LocationData} LocationData object
 */
export default id => {
  const loadSedaData = useLoadSedaData()
  const region = getRegionFromLocationId(id)
  const data = useStaticData(state => state.data)
  const regionData = data[region]
  // load data if it doesn't exist
  !regionData && region && loadSedaData(region)
  // null if data is not available
  if (!id || !regionData || !regionData.length) return null
  const location = regionData.find(d => d.id === id)
  // null if location is not found in the data
  if (!location) return null
  const [ name, parentLocation ] = getLocationNameParts(location)
  return {
    ...location,
    name,
    parentLocation
  }
}
