import shallow from 'zustand/shallow'
import useMapStore from './useMapStore'

/**
 * Provides pixel dimensions of the map viewport
 * @returns {[number, number]} [width, height]
 */
export default function useMapSize() {
  return useMapStore(
    state => [state.viewport.width, state.viewport.height],
    shallow
  )
}
