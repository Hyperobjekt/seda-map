import useDataOptions from '../../app/hooks/useDataOptions'

/**
 * Provides a function for adding location (GeoJSON features) to
 * the selected locations list
 * @returns {function}
 */
export default () => {
  return useDataOptions(state => state.addLocation)
}
