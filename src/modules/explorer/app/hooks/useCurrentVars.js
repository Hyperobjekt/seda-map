import useDataOptions from './useDataOptions'
import { getVarNames } from '../selectors'
import shallow from 'zustand/shallow'

/**
 * Provides current variables for the provided type
 * @param {string} ['chart', 'map', 'gap']
 * @returns {[string, string, string]} [xVar, yVar, zVar]
 */
export default (type = 'chart') => {
  return useDataOptions(
    state =>
      getVarNames(
        state.region,
        state.metric,
        state.secondary,
        state.demographic,
        type
      ),
    shallow
  )
}
