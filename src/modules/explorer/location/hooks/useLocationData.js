import useStaticData from '../../../data/useStaticData'
import { getRegionFromLocationId } from '../../app/selectors'
import { useLoadSedaData } from '../../loader'

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
  return id && regionData && regionData.length
    ? regionData.find(d => d.id === id)
    : null
}
