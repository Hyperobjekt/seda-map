import useDataOptions from './useDataOptions'
import shallow from 'zustand/shallow'

/**
 * Provides the current values for metric, demographic, and region
 * @returns {[string, string, string]} [metricId, demographicId, regionId]
 */
export default function useActiveOptions() {
  return useDataOptions(
    state => [state.metric, state.demographic, state.region],
    shallow
  )
}
