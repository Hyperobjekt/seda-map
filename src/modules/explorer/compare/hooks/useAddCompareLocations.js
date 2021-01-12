import { useCallback } from 'react'
import shallow from 'zustand/shallow'
import useCompareStore from './useCompareStore'

/**
 * Hook that returns a function that gets location data from a
 * collection of IDs and adds it to the compare location store
 */
export default function useAddCompareLocations() {
  const [addLocations, locations] = useCompareStore(
    state => [state.addLocations, state.locations],
    shallow
  )

  return useCallback(
    ids => {
      const newLocations = ids.filter(
        l => !!l && locations.indexOf(l) === -1
      )
      console.log(
        'adding locations to compare store',
        ids,
        newLocations
      )
      addLocations(newLocations)
    },
    [addLocations, locations]
  )
}
