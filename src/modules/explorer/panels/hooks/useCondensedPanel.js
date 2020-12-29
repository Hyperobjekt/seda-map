import shallow from 'zustand/shallow'
import { useUiStore } from '../../app/hooks'

/**
 * Provides the currently active selection panel value
 * ('metric', 'region', 'demographic', 'filter', 'location',
 * or null for no panel) and setter function
 * @returns [string, function]
 */
export default () => {
  return useUiStore(
    state => [state.condensed, state.toggleCondensed],
    shallow
  )
}
