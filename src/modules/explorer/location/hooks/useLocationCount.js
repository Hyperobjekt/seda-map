import useDataOptions from '../../app/hooks/useDataOptions'

/**
 * Provides count of current locations
 * @returns {number}
 */
export default () => {
  return useDataOptions(state => state.locations.length)
}
