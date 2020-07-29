import create from 'zustand'
import * as _isEqual from 'lodash.isequal'
import logger from '../logger'

/**
 * Updates the the filters with the provided updated filter rule
 * @param {*} filters
 * @param {*} updatedFilter
 */
const updateRule = (filters, updatedFilter) => {
  const filterRule = updatedFilter[0]
  if (!filterRule || typeof filterRule !== 'string')
    throw new Error(
      'invalid filter rule, index 0 must be rule name'
    )
  const updatedFilters = filters.map(f =>
    f[0] === filterRule ? updatedFilter : f
  )
  logger.debug(`updated ${filterRule} rule:`, updatedFilters)
  return updatedFilters
}

/**
 * Thunk that handles adding a new filter to the
 * array of filter rules.
 * @param {*} set
 */
const addFilter = set => filter => {
  set(state => {
    const id = filter[0]

    // check if sort rule exists
    const sortIndex = state.filters.findIndex(
      f => f[0] === 'sort'
    )
    // if sort rule exists, return the updated value
    if (id === 'sort' && sortIndex > -1)
      return { filters: updateRule(state.filters, filter) }

    // check if a limit rule exists
    const limitIndex = state.filters.findIndex(
      f => f[0] === 'limit'
    )
    // if a limit rule exists, return the updated value
    if (id === 'limit' && limitIndex > -1)
      return { filters: updateRule(state.filters, filter) }

    // this is a new rule, insert it at the appropriate spot
    // below existing rules but above sort / limit
    const insertIndex =
      sortIndex > -1
        ? sortIndex
        : limitIndex > -1
        ? limitIndex
        : state.filters.length
    const startValues = state.filters.slice(0, insertIndex)
    const endValues = state.filters.slice(insertIndex)
    const result = [...startValues, filter, ...endValues]
    logger.debug('added filter rule:', filter, result)
    return { filters: result }
  })
}

/**
 * Thunk that updates a value in one of the existing filter rules
 * @param {*} set
 */
const updateFilter = set => (ruleIndex, valueIndex, value) =>
  set(state => {
    const updatedFilters = state.filters.map((f, i) => {
      if (i !== ruleIndex) return f
      const newValue = [...f]
      newValue[valueIndex + 1] = value
      return newValue
    })
    logger.debug(
      'updated filter rule:',
      state.filters[ruleIndex],
      updatedFilters[ruleIndex],
      updatedFilters
    )
    return { filters: updatedFilters }
  })

/**
 * Thunk that removes a filter rule
 * @param {*} set
 */
const removeFilter = set => filter =>
  set(state => {
    const updatedFilters = state.filters.filter(
      f => !_isEqual(f, filter)
    )
    logger.debug('removed filter rule', filter, updatedFilters)
    return { filters: updatedFilters }
  })

const [useFilterStore] = create(set => ({
  filters: [['sort', 'all_sz', 'asc'], ['limit', 2500]],
  addFilter: addFilter(set),
  setFilters: filters => set({ filters }),
  updateFilter: updateFilter(set),
  removeFilter: removeFilter(set),
  clearFilters: () => set({ filters: [] })
}))

export default useFilterStore
