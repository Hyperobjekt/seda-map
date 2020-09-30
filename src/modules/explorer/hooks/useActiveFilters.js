import useFilterStore from '../../filters'

/**
 * Provides the currently active filters
 * @returns {Array<FilterRule>}
 */
export default () => {
  const filters = useFilterStore(state => state.filters)
  console.log('fite chabge')
  // remove "sort" from filters, as it is tied to the "limit" filter
  return filters.filter(f => f[0] === 'sort')
}
