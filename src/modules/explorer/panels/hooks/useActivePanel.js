import { useUiStore } from '../../app/hooks'
import shallow from 'zustand/shallow'
import { useActiveLocation } from '../../location'
import { useCallback, useMemo } from 'react'

/**
 * Provides the currently active selection panel value
 * ('metric', 'region', 'demographic', 'filter', 'location',
 * or null for no panel) and setter function
 * @returns [string, function]
 */
export default () => {
  const [activeLocation, setActiveLocation] = useActiveLocation()
  const [selection, setSelection] = useUiStore(
    state => [state.selection, state.setSelection],
    shallow
  )
  // clears active location if there is one when setting panel
  const setSelectionPanel = useCallback(
    selection => {
      if (selection && activeLocation) setActiveLocation(null)
      setSelection(selection)
    },
    [activeLocation, setActiveLocation, setSelection]
  )
  return useMemo(() => [selection, setSelectionPanel], [
    selection,
    setSelectionPanel
  ])
}
