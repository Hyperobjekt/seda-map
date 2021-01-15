import { useMemo } from 'react'
import { getFilterValue } from '../../../filters/useFilterStore'
import useActiveFilters from './useActiveFilters'

export default function useFilterLocation() {
  // grab filters array
  const filters = useActiveFilters()
  const locationId = getFilterValue(filters, [
    'startsWith',
    'id'
  ])
  return useMemo(() => locationId, [locationId])
}
