import useFilters from './useFilters'

/**
 * Returns the currently active filters in the explorer
 */
export default () => {
  const filters = useFilters()
  // ignore "sort" because it is ties to the "limit" rule
  return filters.filter(f => f[0] !== 'sort')
}
