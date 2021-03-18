import useFilters from './useFilters'
import { useDataOptions } from '../../app/hooks'
import { FILTER_FLAGS } from '../../app/constants/flags'
import { useMemo } from 'react'
import { getFilterValue } from '../../../filters/useFilterStore'
import { getSecondaryForDemographic } from '../../app/selectors'
import shallow from 'zustand/shallow'

/**
 * Returns the currently active filters in the explorer
 */
export default () => {
  const filters = useFilters()
  const [region, demographic] = useDataOptions(
    state => [state.region, state.demographic],
    shallow
  )

  return useMemo(() => {
    const flags = FILTER_FLAGS[region].flat()
    const locationId = getFilterValue(filters, [
      'startsWith',
      'id'
    ])
    return (
      filters
        // remove flags that don't apply to the current region
        .filter(f =>
          f[0] !== 'neq' && f[0] !== 'eq'
            ? true
            : flags.indexOf(f[1]) > -1
        )

        // remove frl range if not viewing schools
        .filter(f => {
          if (f[0] !== 'range') return true
          if (f[1] === 'frl' && region !== 'schools')
            return false
          return true
        })
        // remove location if it doesn't apply to current region
        .filter(f => {
          if (f[0] !== 'startsWith') return true
          // no location filter on counties / districts when location is district
          if (
            region !== 'schools' &&
            locationId &&
            locationId.length > 5
          )
            return false
          // no location filter on states
          if (
            region === 'states' &&
            locationId &&
            locationId.length > 0
          )
            return false
          return true
        })
        // remove ses if viewing schools
        .filter(f => {
          if (f[0] !== 'range') return true
          if (f[1] === 'ses' && region === 'schools')
            return false
          return true
        })
        // remove SES for subgroups that don't have it
        .filter(f => {
          if (f[0] !== 'range') return true
          const secondary = getSecondaryForDemographic(
            demographic
          )
          if (f[1] === 'ses' && secondary.indexOf('ses') === -1)
            return false
          return true
        })
    )
  }, [filters, region, demographic])
}
