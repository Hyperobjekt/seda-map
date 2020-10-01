import useDataOptions from '../../hooks/useDataOptions'
import useLocationData from './useLocationData'

/**
 * Pulls an object containing all of the data for the active locations
 * @returns {LocationData} LocationData object
 */
export default () => {
  const id = useDataOptions(state => state.activeLocation)
  return useLocationData(id)
}
