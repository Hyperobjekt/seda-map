import useDataOptions from '../../hooks/useDataOptions'
import useStaticData from '../../../data/useStaticData'

/**
 * Provides data from the store for the given ID
 * @param {string} id
 * @returns {LocationData} LocationData object
 */
export default id => {
  const region = useDataOptions(state => state.region)
  const data = useStaticData(state => state.data)
  const regionData = data[region]
  return regionData && regionData.length
    ? regionData.find(d => d.id === id)
    : null
}
