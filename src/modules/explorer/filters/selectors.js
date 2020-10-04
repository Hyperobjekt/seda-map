/**
 * Returns the count of active filters based on the filter array
 * @param {*} filters
 */
export const getActiveFilterCount = filters => {
  // "sort" doesn't count as an active filter because it's tied to "limit"
  return filters.filter(f => f[0] !== 'sort').length
}

/**
 * Adds a demographic to the current range and sort filters
 */
export const getFiltersForDemographic = (
  filters,
  demographic
) => {
  return filters.map(f => {
    if (f[0] !== 'range' && f[0] !== 'sort') return f
    return [f[0], demographic + '_' + f[1], f[2]]
  })
}

/**
 * Removes any filter rules that do not apply to the provided region
 * (e.g. removes "frl" from if region is non-schools, or "ses" from schools)
 */
export const removeIrrelevantFilters = (filters, region) => {
  return region === 'schools'
    ? filters.filter(f => f[1] !== 'ses')
    : filters.filter(f => f[1] !== 'frl' && f[0] !== 'contains')
}

export const getHumanReadableFilters = filters => {}
