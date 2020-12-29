import useDataOptions from './useDataOptions'
import shallow from 'zustand/shallow'

/**
 * Provides the current metric id and setter
 * @returns {[string, function]} [metricId, setMetric]
 */
export default function useMetric() {
  return useDataOptions(
    state => [state.metric, state.setMetric],
    shallow
  )
}
