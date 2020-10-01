import { useUiStore } from '../hooks'
import shallow from 'zustand/shallow'

/**
 * Provides site menu visible value and toggle function
 * @returns {[boolean, Function]}  [ showMenu, toggleMenu ]
 */
export default () => {
  return useUiStore(
    state => [state.showMenu, state.toggleMenu],
    shallow
  )
}
