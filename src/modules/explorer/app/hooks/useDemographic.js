import useDataOptions from './useDataOptions'
import shallow from 'zustand/shallow'

/**
 * Provides the current demographic id and setter
 * @returns {[string, function]} [demographicId, setDemographic]
 */
export default function useDemographic() {
  return useDataOptions(
    state => [state.demographic, state.setDemographic],
    shallow
  )
}
