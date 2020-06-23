import { getStateAbbr } from '../../shared/utils/states'
import { getRegionFromLocationId } from './selectors'

/**
 * Mergest data from the feature store and the
 * scatterplot store for the provided identifier.
 * @param {*} id
 * @param {*} data
 */
export const getDataForId = (id, data, featureData = {}) => {
  if (!data && !featureData) return null
  data = data || {}
  featureData = featureData || {}
  const feature = featureData[id] || {}
  const base = {
    id,
    state: getStateAbbr(id),
    region: getRegionFromLocationId(id),
    ...feature
  }
  return Object.keys(data).reduce((acc, curr) => {
    // only add data if it exists
    if (data[curr][id] || data[curr][id] === 0) {
      acc[curr] = data[curr][id]
    }
    return acc
  }, base)
}
