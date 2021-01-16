import shallow from 'zustand/shallow'
import { useUiStore } from '../../app/hooks'
import useIsMobile from '../../app/hooks/useIsMobile'

/**
 * Provides the currently active selection panel value
 * ('metric', 'region', 'demographic', 'filter', 'location',
 * or null for no panel) and setter function
 * @returns [string, function]
 */
export default () => {
  const isMobile = useIsMobile()
  console.log('is mobile?', isMobile)
  return useUiStore(
    state => [isMobile ? false : state.condensed, state.toggleCondensed],
    shallow
  )
}
