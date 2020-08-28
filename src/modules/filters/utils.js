import * as _debounce from 'lodash.debounce'

const filterStartsWith = (data, column, value) =>
  data.filter((d, i) => d[column] && d[column].startsWith(value))

const filterEquals = (data, column, value) =>
  data.filter((d, i) => d[column] === value)

const filterNotEquals = (data, column, value) =>
  data.filter((d, i) => d[column] !== value)

const filterGreaterThan = (data, column, value) =>
  data.filter((d, i) => d[column] > value)

const filterGreaterThanEqual = (data, column, value) =>
  data.filter((d, i) => d[column] >= value)

const filterLessThan = (data, column, value) =>
  data.filter((d, i) => d[column] < value)

const filterLessThanEqual = (data, column, value) =>
  data.filter((d, i) => d[column] <= value)

const filterHas = (data, column) =>
  data.filter((d, i) => d[column] || d[column] === 0)

const filterContains = (data, column, value) => {
  return data.filter(
    (d, i) =>
      typeof d[column] === 'string' && d[column].includes(value)
  )
}

const filterRange = (data, column, value) =>
  data.filter(
    (d, i) => d[column] >= value[0] && d[column] <= value[1]
  )

const filterSort = (data, column, direction = 'asc') => {
  const desc = direction === 'desc'
  return [...data].sort((a, b) => {
    if (a[column] > b[column]) return desc ? 1 : -1
    if (a[column] < b[column]) return desc ? -1 : 1
    return 0
  })
}

const filterLimit = (data, amount, offset = 0) => {
  return data.slice(offset, amount)
}

const filterRules = {
  startsWith: filterStartsWith,
  contains: filterContains,
  eq: filterEquals,
  neq: filterNotEquals,
  gt: filterGreaterThan,
  lt: filterLessThan,
  gte: filterGreaterThanEqual,
  lte: filterLessThanEqual,
  has: filterHas,
  range: filterRange,
  sort: filterSort,
  limit: filterLimit
}

/**
 * Registers a filter function with the associated name
 * @param {*} name
 * @param {*} filterFunction
 */
export const registerFilterRule = (name, filterFunction) => {
  filterRules[name] = filterFunction
}

/**
 * Checks if a filter rule exists
 * @param {*} name
 */
export const hasFilterRule = name => {
  return filterRules.hasOwnProperty(name)
}

/**
 * Applies a single filter rule to the data set
 * @param {Object} data
 * @param {Array} rule
 * @returns {Object}
 */
export const applyFilterRule = (data, rule) => {
  const [condition, ...rest] = rule
  const ruleFunction = filterRules[condition]
  if (!ruleFunction)
    throw new Error(
      `no filter rule for condition "${condition}", 
      to add a custom filter rule use "registerFilterRule"`
    )
  return ruleFunction(data, ...rest)
}

/**
 * Applies any filters in the filters array to the data
 * @param {*} data
 * @param {*} filters
 */
export const applyFilters = (data, filters) => {
  return filters.reduce(
    (subset, rule) => applyFilterRule(subset, rule),
    data
  )
}
