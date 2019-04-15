import * as scale from 'd3-scale';
import * as d3array from 'd3-array';

const idLengths = {
  2: 'states',
  5: 'counties',
  7: 'districts',
  12: 'schools'
}

export const intToRegionId = (value, region) => {
  const s = "0000000000000" + value;
  const length = Object.keys(idLengths)
    .find(k => idLengths[k] === region)
  if (length) {
    return s.substr(s.length - parseInt(length));
  }
  throw new Error('no id length for region ' + region)
}

/**
 * Maps the data object to new keys based on the provided keyMap
 * @param {object} obj the object for which the keys should be mapped
 * @param {object} keyMap a map of { oldKey: newKey }
 * @returns {object} object containing the new keys in keyMap
 */
export const mapObjectKeys = (obj, keyMap) =>
  Object.keys(keyMap).reduce((acc, curr) => {
    if (obj[curr]) {
      acc[keyMap[curr]] = obj[curr];
    }
    return acc;
  }, {})

/**
 * Gets the region that corresponds to the provided ID
 * @param {string} id 
 */
export const getRegionFromId = (id) => {
  if (!id) { return null; }
  if (!idLengths[id.length]) {
    throw new Error('No region corresponding to provided ID');
  }
  return idLengths[id.length]
}

export const getSingularRegion = (region) => {
  switch(region) {
    case 'districts':
      return 'school district'
    case 'counties':
      return 'county'
    case 'schools':
      return 'school'
    default:
      throw new Error(`region ${region} does not have singular`)
  }
}

export const makeId = () =>
  '_' + Math.random().toString(36).substr(2, 9)

/**
 * Gets the range for the provided dataset, while filtering
 * out extreme outliers
 * @param {object} data 
 */
const getDataRange = (data) => {
  const values = Object.keys(data)
    .map(k => parseFloat(data[k]))
    .filter(v => v > -9999)
    .sort((a, b) => a - b);
  return [
    d3array.min(values), 
    d3array.max(values)
  ]
}

/**
 * Returns a scale function that can be used to map data values
 * to dot sizes
 * @param {object} data data to generate scale for (e.g. { '01001': 3.4, ... })
 * @param {object} options range and exponent options for scale
 */
export const getSizerFunction = (
  data, 
  { range = [0, 1], exponent = 1 }
) => {
  if (!data) { return () => 0 }
  return scale.scalePow()
    .exponent(exponent)
    .domain(getDataRange(data))
    .range(range)
    .clamp(true);
}