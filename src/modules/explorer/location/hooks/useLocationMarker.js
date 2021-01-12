import shallow from 'zustand/shallow'
import useDataOptions from '../../app/hooks/useDataOptions'
import { getLocationMarker } from '../selectors'

/**
 * Provides the location number and color for a provided location id,
 * based on the current location selections (used for location markers)
 * @param {*} id
 * @returns {{number, label}}
 */
export default id => {
  return useDataOptions(state => 
    getLocationMarker(state.locations, id, state.region)
  , shallow)
}
