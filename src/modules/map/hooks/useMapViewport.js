import shallow from 'zustand/shallow'
import useMapStore from './useMapStore'

/**
 * Provides map viewport value and setter
 * @returns {[object, function]} [viewport, setViewport]
 */
export default function useMapViewport() {
  return useMapStore(
    state => [state.viewport, state.setViewport],
    shallow
  )
}
