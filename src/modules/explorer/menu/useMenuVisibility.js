import shallow from 'zustand/shallow'
import { useUiStore } from '../app/hooks'

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
