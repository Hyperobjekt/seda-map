import useUiStore from './useUiStore'
import shallow from 'zustand/shallow'

/**
 * Provides the id of the hovered location and setter
 * @returns {[string, function]} [ hoveredId, setHovered ]
 */
export default function useHovered() {
  return useUiStore(
    state => [state.hovered, state.setHovered],
    shallow
  )
}
