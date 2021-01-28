/**
 * Filters data that does not have a value that starts with the provided `value`
 * @param {*} data
 * @param {string} column
 * @param {string|number} value
 */
const filterStartsWith = (data, column, value) =>
  data.filter((d, i) => d[column] && d[column].startsWith(value))

/**
 * Filters entries that do not have a value that is equal to the provided `value`
 * @param {*} data
 * @param {string} column
 * @param {string|number} value
 */
const filterEquals = (data, column, value) =>
  data.filter((d, i) => d[column] === value)

/**
 * Filters entries that do not have a value that is not equal to the provided `value`
 * @param {*} data
 * @param {string} column
 * @param {string|number} value
 */
const filterNotEquals = (data, column, value) =>
  data.filter((d, i) => d[column] !== value)

/**
 * Filters entries that do not have a value greater than a provided `value`
 * @param {*} data
 * @param {string} column
 * @param {number} value
 */
const filterGreaterThan = (data, column, value) =>
  data.filter((d, i) => d[column] > value)

/**
 * Filters entries that do not have a value greater than or equal to a provided `value`
 * @param {*} data
 * @param {string} column
 * @param {number} value
 */
const filterGreaterThanEqual = (data, column, value) =>
  data.filter((d, i) => d[column] >= value)

/**
 * Filters datat that does not have a value less than the provided `value`
 * @param {*} data
 * @param {string} column
 * @param {number} value
 */
const filterLessThan = (data, column, value) =>
  data.filter((d, i) => d[column] < value)

/**
 * Filters data that does not have a value less than or equal to the provided `value`
 * @param {*} data
 * @param {string} column
 * @param {number} value
 */
const filterLessThanEqual = (data, column, value) =>
  data.filter((d, i) => d[column] <= value)

/**
 * Filters data that does not have a value for the provided column
 * @param {*} data
 * @param {string} column
 */
const filterHas = (data, column) =>
  data.filter((d, i) => d[column] || d[column] === 0)

/**
 * Filters data that does not include the provided value
 * @param {*} data
 * @param {string} column column name containing string or array data
 * @param {string} value string
 */
const filterContains = (data, column, value) => {
  return data.filter((d, i) => d[column].includes(value))
}

/**
 * Filters data that does not have a value within the provided range
 * @param {*} data
 * @param {string} column
 * @param {Array} value [min, max]
 */
const filterRange = (data, column, value) =>
  data.filter(
    (d, i) => d[column] >= value[0] && d[column] <= value[1]
  )

/**
 * Sorts the data by the provided column and the provided direction
 * @param {*} data
 * @param {string} column
 * @param {string} direction 'asc' | 'desc'
 */
const filterSort = (data, column, direction = 'asc') => {
  const desc = direction === 'desc'
  return [...data].sort((a, b) => {
    if (a[column] > b[column]) return desc ? 1 : -1
    if (a[column] < b[column]) return desc ? -1 : 1
    return 0
  })
}

/**
 * Returns the top `amount` entries in the data, offset by a certain number if `offset` is provided
 * @param {*} data
 * @param {number} amount
 * @param {number} offset
 */
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
  if (!filters || filters.length === 0) return data
  return filters.reduce(
    (subset, rule) => applyFilterRule(subset, rule),
    data
  )
}
