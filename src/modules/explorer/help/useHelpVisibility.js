import shallow from 'zustand/shallow'
import { useUiStore } from '../app/hooks'

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
