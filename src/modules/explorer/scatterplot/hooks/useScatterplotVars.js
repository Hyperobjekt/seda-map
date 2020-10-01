import useDataOptions from '../../hooks/useDataOptions'
import { getVarNames } from '../../selectors'
import shallow from 'zustand/shallow'

/**
 * Provides x, y, z scatterplot variables for current data options
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
