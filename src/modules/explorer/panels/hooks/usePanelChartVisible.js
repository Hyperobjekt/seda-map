import { useUiStore } from '../../app/hooks'
import shallow from 'zustand/shallow'

/**
 * Provides preview chart visible value and toggle function
 * @returns {[boolean, Function]} [ showChart, toggleChart ]
 */
export default () => {
  return useUiStore(
    state => [state.showChart, state.toggleChart],
    shallow
  )
}
