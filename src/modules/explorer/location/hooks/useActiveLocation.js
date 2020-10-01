import useDataOptions from '../../hooks/useDataOptions'
import shallow from 'zustand/shallow'

/**
 * Grabs the active location ID and setter
 * @returns {[string, Function]}
 */
export default () =>
  useDataOptions(
    state => [state.activeLocation, state.setActiveLocation],
    shallow
  )
