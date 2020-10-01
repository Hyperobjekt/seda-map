import { useUiStore } from '../../hooks'
import shallow from 'zustand/shallow'

/**
 * Provides the screen coordinates of the tooltip and setter function
 * @returns {[[number, number], Function]} [ [x, y], setCoords ]
 */
export default () => {
  return useUiStore(
    state => [state.coords, state.setCoords],
    shallow
  )
}
