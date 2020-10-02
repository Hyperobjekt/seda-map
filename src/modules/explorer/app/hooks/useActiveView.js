import useUiStore from './useUiStore'
import shallow from 'zustand/shallow'

/**
 * Value and setter for current view ("map", "chart", or "split")
 * @returns [string, function]
 */
export default function useActiveView() {
  return useUiStore(
    state => [state.view, state.setView],
    shallow
  )
}
