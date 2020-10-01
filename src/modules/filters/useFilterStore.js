import create from 'zustand'
import * as _isEqual from 'lodash.isequal'
import logger from '../logger'
import shallow from 'zustand/shallow'

/**
 * Updates the the filters with the provided updated filter rule
 * @param {*} filters
 * @param {*} updatedFilter
 */
const updateRule = (filters, rule) => {
  const value = rule.slice(rule.length - 1)[0]
  const params = rule.slice(0, rule.length - 1)
  const index = getFilterIndex(filters, params)
  if (index === -1)
    throw new Error(
      'filter does not exist and cannot be updated'
    )
  const updatedRule = filters[index].slice()
  updatedRule[updatedRule.length - 1] = value
  const updatedFilters = filters.map((f, i) =>
    index === i ? updatedRule : f
  )
  return updatedFilters
}

/**
 * Checks if the filters has the provided rule
 * @param {*} filters
 * @param {*} rule
 */
export const hasFilterRule = (filters, rule) => {
  return getFilterIndex(filters, rule) > -1
}

/**
 * Gets the index of the filter that matches the provided params
 */
export const getFilterIndex = (filters, params) =>
  filters.reduce((idx, curFilter, filterIndex) => {
    if (idx > -1) return idx
    const isEqual = params.reduce(
      (eq, param, index) =>
        eq ? curFilter[index] === param : false,
      true
    )
    return isEqual ? filterIndex : -1
  }, -1)

export const getFilterValue = (filters, params) => {
  const rule = filters.find(f =>
    params.reduce(
      (eq, param, index) => (eq ? f[index] === param : false),
      true
    )
  )
  // the value is the next index after the provided params
  return rule ? rule[params.length] : null
}

/**
 * Inserts a filter into the provided filters array
 * @param {*} filters
 * @param {*} filter
 * @param {*} atIndex
 */
const insertFilter = (filters, filter, atIndex) => {
  const id = filter[0]
  // check if sort rule exists
  const sortIndex = filters.findIndex(f => f[0] === 'sort')
  // if sort rule exists, return the updated value
  if (id === 'sort' && sortIndex > -1)
    return { filters: updateRule(filters, filter) }
  // check if a limit rule exists
  const limitIndex = filters.findIndex(f => f[0] === 'limit')
  // if a limit rule exists, return the updated value
  if (id === 'limit' && limitIndex > -1)
    return { filters: updateRule(filters, filter) }
  // this is a new rule, insert it at the appropriate spot
  // below existing rules but above sort / limit
  const insertIndex = atIndex
    ? atIndex
    : sortIndex > -1
    ? sortIndex
    : limitIndex > -1
    ? limitIndex
    : filters.length
  const startValues = filters.slice(0, insertIndex)
  const endValues = filters.slice(insertIndex)
  const result = [...startValues, filter, ...endValues]
  return result
}

/**
 * Deletes a filter from the provided filters if it exists
 * @param {*} filters
 * @param {*} rule
 * @param {*} noValue true if the provided rule does not contain a value, this is used to match a rule regardless of value
 */
const deleteFilter = (filters, rule, noValue) => {
  const sliceIndex = noValue ? rule.length : rule.length - 1
  const params = rule.slice(0, sliceIndex)
  const index = getFilterIndex(filters, params)
  const newFilters = filters.filter((f, i) => index !== i)
  return newFilters
}

/**
 * Thunk that handles adding a new filter to the
 * array of filter rules.
 * @param {*} set
 */
const addFilter = set => (filter, atIndex) => {
  set(state => {
    const newFilters = insertFilter(
      state.filters,
      filter,
      atIndex
    )
    logger.debug('added filter rule', filter, newFilters)
    return { filters: newFilters }
  })
}

/**
 * Thunk that removes a filter rule
 * @param {*} set
 */
const removeFilter = (set, get) => (rule, noValue) => {
  const filters = get().filters
  if (!hasFilterRule(filters, rule)) return
  set(state => {
    const updatedFilters = deleteFilter(
      state.filters,
      rule,
      noValue
    )
    logger.debug('removed filter rule', rule, updatedFilters)
    return { filters: updatedFilters }
  })
}

/**
 * Adds a filter rule or updates and existing one
 */
export const setFilter = set => rule => {
  const params = rule.slice(0, rule.length - 1)
  return set(state => {
    const index = getFilterIndex(state.filters, params)
    const newFilters =
      index > -1
        ? updateRule(state.filters, rule)
        : insertFilter(state.filters, rule)
    logger.debug('set filter rule', rule, newFilters)
    return { filters: newFilters }
  })
}

export const DEFAULT_FILTERS = []

const [useFilterStore] = create((set, get) => ({
  filters: DEFAULT_FILTERS,
  addFilter: addFilter(set),
  setFilters: filters => set({ filters }),
  setFilter: setFilter(set),
  removeFilter: removeFilter(set, get),
  clearFilters: () => set({ filters: DEFAULT_FILTERS })
}))

export default useFilterStore
