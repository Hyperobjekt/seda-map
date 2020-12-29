import useUiStore from './useUiStore'
import shallow from 'zustand/shallow'

/**
 * Provides boolean and setter that determines if
 * markers should show for the hovered location.
 * Markers include map outline, scatterplot dot outline,
 * and map legend tick.
 * @returns {[boolean, Function]} [ showMarkers, setShowMarkers ]
 */
export default function useMarkersVisibility() {
  return useUiStore(
    state => [state.showMarkers, state.setShowMarkers],
    shallow
  )
}
