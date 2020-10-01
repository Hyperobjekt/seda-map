import useDataOptions from '../../hooks/useDataOptions'
import shallow from 'zustand/shallow'

/**
 * Grabs an array of features for locations and a setter from the store
 * @returns {[Array<Feature>, Function]>}
 */
export default () =>
  useDataOptions(
    state => [state.locations, state.setLocations],
    shallow
  )
