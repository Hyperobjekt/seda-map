import { useUiStore } from '../hooks'
import shallow from 'zustand/shallow'

/**
 * Provides help panel visible value and toggle function
 * @returns {[boolean, Function]}  [ showHelp, toggleHelp ]
 */
export default () => {
  return useUiStore(
    state => [state.showHelp, state.toggleHelp],
    shallow
  )
}
