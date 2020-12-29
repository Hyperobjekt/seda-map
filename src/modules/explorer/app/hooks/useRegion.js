import useDataOptions from './useDataOptions'
import shallow from 'zustand/shallow'

/**
 * Provides the current region id and setter
 * @returns {[string, function]} [regionId, setRegion]
 */
export default function useRegion() {
  return useDataOptions(
    state => [state.region, state.setRegion],
    shallow
  )
}
