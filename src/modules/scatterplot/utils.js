import * as scale from 'd3-scale'
import { quantile } from 'd3-array'

/**
 * Pulls provided vars from the data, with ID as the last array element
 * @param {*} data
 * @param {*} vars
 */
export const getDataSubset = (data, vars) => {
  return data.map(d => [...vars.map(v => d[v]), d.id])
}

/**
 * Gets the range for the provided dataset, while filtering
 * out extreme outliers
 * @param {object} data
 */
const getDataRange = values => {
  const sortedValues = values
    .filter(v => v > -999)
    .sort((a, b) => a - b)
  return [
    quantile(sortedValues, 0.001),
    quantile(sortedValues, 0.999)
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
  if (!data || data.length === 0) {
    return () => 0
  }
  return scale
    .scalePow()
    .exponent(exponent)
    .domain(getDataRange(data))
    .range(range)
    .clamp(true)
}
