/**
 * Returns the count of active filters based on the filter array
 * @param {*} filters
 */
export const getActiveFilterCount = filters => {
  // "sort" doesn't count as an active filter because it's tied to "limit"
  return filters.filter(f => f[0] !== 'sort').length
}

export const getHumanReadableFilters = filters => {}
