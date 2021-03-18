import { getSecondaryForDemographic } from '../app/selectors'

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
    // no demographic for non-range and non-sort filters
    if (f[0] !== 'range' && f[0] !== 'sort') return f
    // for SES, if no demographic specific SES, use all_ses
    if (f[1] === 'ses') {
      const secondaryMetrics = getSecondaryForDemographic(
        demographic
      )
      const sesDem =
        secondaryMetrics.indexOf('ses') > -1
          ? demographic
          : 'all'
      return [f[0], sesDem + '_' + f[1], f[2]]
    }
    // add demographic to metric
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

/**
 * Returns the search indicies for the current region
 * @param {*} region
 */
export const getIndiciesForSearch = region => {
  switch (region) {
    case 'states':
      return []
    case 'counties':
      return ['states']
    case 'districts':
      return ['states']
    default:
      return ['states', 'districts']
  }
}
