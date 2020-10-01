import { getStateName } from '../../../../shared/utils/states'
import { getRegionFromLocationId } from '../../app/selectors'
import useLocationData from './useLocationData'

/**
 * Provides name for the given id
 * @param {string} id
 * @returns {string}
 */
export default id => {
  const locationData = useLocationData(id)
  const region = getRegionFromLocationId(id)
  switch (region) {
    case 'states':
      return getStateName(id)
    default:
      return locationData['name']
  }
}
