import useFilters from './useFilters'
import { useRegion } from '../../app/hooks'
import { FILTER_FLAGS } from '../../app/constants/flags'
import { useMemo } from 'react'

/**
 * Returns the currently active filters in the explorer
 */
export default () => {
  const filters = useFilters()
  const [region] = useRegion()

  return useMemo(() => {
    const flags = FILTER_FLAGS[region]
    return (
      filters
        // remove flags that don't apply to the current region
        .filter(f =>
          f[0] !== 'eq' ? true : flags.indexOf(f[1]) > -1
        )
        // remove frl range if not viewing schools
        .filter(f => {
          if (f[0] !== 'range') return true
          if (f[1] === 'frl' && region !== 'schools')
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
    )
  }, [filters, region])
}
