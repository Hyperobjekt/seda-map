import useDataOptions from './useDataOptions'
import shallow from 'zustand/shallow'

/**
 * Provides the secondary metric id and setter
 * @returns {[string, function]} [metricId, setMetric]
 */
export default function useSecondary() {
  return useDataOptions(
    state => [state.secondary, state.setSecondary],
    shallow
  )
}
