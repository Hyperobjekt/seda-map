import { useCallback } from 'react'
import { getPropFromHit } from '../selectors'
import { useActiveLocation } from '../../location'

/**
 * Returns a callback function that accepts a search hit and activates the location
 */
export default function useActivateSearchHit() {
  const [, setActiveLocation] = useActiveLocation()
  return useCallback(
    hit => {
      const id = getPropFromHit(hit, 'id')
      if (id) {
        setActiveLocation(id)
      } else {
        console.warn('unable to activate location: ' + id)
      }
    },
    [setActiveLocation]
  )
}
