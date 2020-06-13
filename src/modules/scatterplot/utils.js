import * as scale from 'd3-scale'
import * as d3array from 'd3-array'

/**
 * Takes multiple data sets with identifiers and merges them
 * into one for use with echarts scatterplot. Filters out
 * entries where there are not values in all data sets.
 * @param {object} sets a variable amount of data sets - e.g. { "01001": 3.45, ... }
 * @returns {object} e.g. { "01001": [ 3.45, 5.10, 01001 ], ... }
 */
export const mergeDatasets = (...sets) => {
  // filter out IDs that are not common to all sets
  const ids = Object.keys(sets[0]).filter(id =>
    sets.reduce(
      (acc, curr) =>
        acc
          ? curr.hasOwnProperty(id) &&
            parseFloat(curr[id]) > -9999 &&
            parseFloat(curr[id]) > -9999 &&
            id !== '' &&
            id !== 'id'
          : false,
      true
    )
  )
  // create an object with all merged data
  const merged = ids.reduce((acc, curr) => {
    acc[curr] = [...sets.map(s => parseFloat(s[curr])), curr]
    return acc
  }, {})
  return merged
}

/**
 * Returns provided datasets merged into an array that
 * can be used with eCharts data series.
 * @param  {...any} sets a variable number of data sets (e.g { '0100001' : 2.44, ... })
 */
export const getScatterplotData = (...sets) => {
  if (sets.length < 1) {
    throw new Error(
      'Cannot create scatterplot data with less than two variables'
    )
  }
  const merged = mergeDatasets(...sets)
  return Object.keys(merged).map(k => merged[k])
}

/**
 * Gets the range for the provided dataset, while filtering
 * out extreme outliers
 * @param {object} data
 */
const getDataRange = data => {
  const values = Object.keys(data)
    .map(k => parseFloat(data[k]))
    .filter(v => v > -9999)
    .sort((a, b) => a - b)
  return [
    d3array.quantile(values, 0.001),
    d3array.quantile(values, 0.999)
  ]
}

/**
 * Returns a scale function that can be used to map data values
 * to dot sizes
 * @param {object} data data to generate scale for
 * @param {object} options range and exponent options for scale
 */
export const getDataScale = (
  data,
  { range = [0, 1], exponent = 1 }
) => {
  if (!data) {
    return () => 0
  }
  return scale
    .scalePow()
    .exponent(exponent)
    .domain(getDataRange(data))
    .range(range)
    .clamp(true)
}
