import shallow from 'zustand/shallow'
import { useUiStore } from '../../hooks'

/**
 * Provides tooltip visible value and setter function
 * @returns {[boolean, Function]} [ showTooltip, setShowTooltip ]
 */
export default () => {
  return useUiStore(
    state => [state.showTooltip, state.setShowTooltip],
    shallow
  )
}
