import useDataOptions from './useDataOptions'
import { isGapDemographic } from '../selectors'

/**
 * Provides the type of demographic currently active
 * @returns {string} `gap` or `single`
 */
export default function useDemographicType() {
  return useDataOptions(state =>
    isGapDemographic(state.demographic) ? 'gap' : 'single'
  )
}
