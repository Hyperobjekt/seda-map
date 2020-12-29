import useUiStore from '../../app/hooks/useUiStore'
import shallow from 'zustand/shallow'

/**
 * Provides the currently active filter selection panel value
 * ("prefix" or "largest", null for no panel) and setter function
 * @returns [string, function]
 */
export default () => {
  return useUiStore(
    state => [state.filterPanel, state.setFilterPanel],
    shallow
  )
}
