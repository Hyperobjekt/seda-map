import { useUiStore } from '../../app/hooks'
import shallow from 'zustand/shallow'

/**
 * Provides the currently active selection panel value
 * ('metric', 'region', 'demographic', 'filter', 'location',
 * or null for no panel) and setter function
 * @returns [string, function]
 */
export default () => {
  return useUiStore(
    state => [state.selection, state.setSelection],
    shallow
  )
}
