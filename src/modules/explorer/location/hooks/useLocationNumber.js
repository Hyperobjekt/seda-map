import useDataOptions from '../../hooks/useDataOptions'

/**
 * Provides the index of the location based on region type,
 * used for location markers
 * @param {*} id
 * @returns {number}
 */
export default id => {
  return useDataOptions(state => {
    const index = state.locations
      .filter(l => l.length === id.length)
      .findIndex(l => l === id)
    return index + 1
  })
}
