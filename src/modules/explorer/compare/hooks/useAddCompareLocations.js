import { useCallback } from 'react'

/**
 * Hook that returns a function that gets location data from a
 * collection of IDs and adds it to the compare location store
 */
export default function useAddCompareLocations() {
  return useCallback(ids => {
    console.log('adding locations to compare store', ids)
  })
}
