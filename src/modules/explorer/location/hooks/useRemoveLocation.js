import { useCallback } from 'react'
import useLocations from './useLocations'

/**
 * Provides a function for removing locations from
 * the selected locations list
 * @returns {function}
 */
export default () => {
  const [locations, setLocations] = useLocations()
  return useCallback(
    id => {
      if (!id)
        throw new Error('tried to remove invalid location')
      const newLocations = locations.filter(
        locationId => locationId !== id
      )
      setLocations(newLocations)
    },
    [locations, setLocations]
  )
}
