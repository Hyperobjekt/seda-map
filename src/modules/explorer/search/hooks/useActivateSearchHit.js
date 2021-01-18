import { useCallback } from 'react'
import { getPropFromHit } from '../selectors'
import shallow from 'zustand/shallow'
import { useDataOptions } from '../../app/hooks'

/**
 * Returns a callback function that accepts a search hit and activates the location
 */
export default function useActivateSearchHit() {
  const [setActiveLocation, addLocation] = useDataOptions(
    state => [state.setActiveLocation, state.addLocation],
    shallow
  )
  return useCallback(
    hit => {
      const id = getPropFromHit(hit, 'id')
      if (id) {
        addLocation(id)
        setActiveLocation(id)
      } else {
        console.warn('unable to activate location: ' + id)
      }
    },
    [setActiveLocation]
  )
}
