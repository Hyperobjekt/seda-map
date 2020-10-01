import useDataOptions from '../../hooks/useDataOptions'
import shallow from 'zustand/shallow'

/**
 * Provides site menu visible value and toggle function
 * @returns {[boolean, Function]}  [ showMenu, toggleMenu ]
 */
export default () => {
  return useDataOptions(
    state => [state.showError, state.setShowError],
    shallow
  )
}
