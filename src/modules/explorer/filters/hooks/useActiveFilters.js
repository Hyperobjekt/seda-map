import useFilters from './useFilters'
import { useDataOptions } from '../../app/hooks'
import { FILTER_FLAGS } from '../../app/constants/flags'
import { useMemo } from 'react'
import { getFilterValue } from '../../../filters/useFilterStore'

/**
 * remove flag filters that don't apply to the current region
 * @param {*} filters
 * @param {*} flags
 * @returns
 */
const adjustFlagFilters = flags => f =>
  f[0] !== 'neq' && f[0] !== 'eq'
    ? true
    : flags.indexOf(f[1]) > -1

/**
 * Removes the SES or FRL filters if they do not apply to the region
 * @param {*} filters
 * @param {*} region
 * @returns
 */
const adjustSecondaryVarFilters = region => f => {
  if (f[0] !== 'range') return true
  if (f[1] === 'frl' && region !== 'schools') return false
  if (f[1] === 'ses' && region === 'schools') return false
  return true
}

/**
 * remove location filter if it doesn't apply to current region
 * @param {*} filters
 * @param {*} region
 * @param {*} locationId
 * @returns
 */
const adjustLocationFilters = (region, locationId) => f => {
  if (f[0] !== 'startsWith') return true
  // no location filter on counties / districts when location is district
  if (
    region !== 'schools' &&
    locationId &&
    locationId.length > 5
  )
    return false
  // no location filter on states
  if (region === 'states' && locationId && locationId.length > 0)
    return false
  return true
}

/**
 * remove limit filter if it's larger than the total amount
 * @param {*} filters
 * @param {*} region
 * @returns
 */
const adjustLimitFilter = region => {
  return f => {
    if (f[0] !== 'limit') return true
    const limit = parseInt(f[1])
    if (region === 'counties' && limit > 3000) return false
    if (region === 'states' && limit > 50) return false
    return true
  }
}

/**
 * Returns the currently active filters in the explorer
 */
export default function useActiveFilters() {
  const filters = useFilters()
  const region = useDataOptions(state => state.region)

  return useMemo(() => {
    const flags = FILTER_FLAGS[region].flat()
    const locationId = getFilterValue(filters, [
      'startsWith',
      'id'
    ])

    const activeFilters = filters
      .filter(adjustFlagFilters(flags))
      .filter(adjustSecondaryVarFilters(region))
      .filter(adjustLocationFilters(region, locationId))
      .filter(adjustLimitFilter(region))

    const hasLimit =
      activeFilters.findIndex(f => f[0] === 'limit') > -1
    const needsLimit =
      ['districts', 'schools'].indexOf(region) > -1

    // add limit if needed
    return needsLimit && !hasLimit
      ? [...activeFilters, ['limit', '10000']]
      : activeFilters
  }, [filters, region])
}
