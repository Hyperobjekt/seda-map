
import { scaleLinear } from 'd3-scale';

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
 * Returns keys that exist in the object
 */
export const getKeysInObject = (keys, obj = {}) =>
  keys.filter((k) => obj.hasOwnProperty(k))


export const makeId = () =>
  '_' + Math.random().toString(36).substr(2, 9)


/**
 * Returns the value for a css variable
 * @param {*} varname 
 */
export const getCSSVariable = (varname) => 
  // eslint-disable-next-line no-undef
  getComputedStyle(document.documentElement)
    .getPropertyValue(varname)

/**
 * Returns the value rounded to the provided number of decimal
 * places.
 */
export const formatNumber = (val, decimals = 2) => {
  if (!val && val !== 0) { return 'N/A' }
  const factor = Math.pow(10, decimals);
  return Math.round(val*factor)/factor
}

/**
 * Returns a percent string
 * @param {number} v 
 */
export const formatPercent = (v, decimals = 0) => {
  if (!v && v !== 0) { return 'N/A' }
  return formatNumber(v * 100, decimals) + '%'
}

/**
 * Returns a percent string of how far the provided value
 * is from the provided `from` value. (used for learning rates)
 * @param {number} v the value to format
 * @param {number} from the point of reference to determine what the % diff is 
 */
export const formatPercentDiff = (v, from = 1) => {
  if (!v && v !== 0) { return 'N/A' }
  return formatPercent(v - from);
}

export const parseColor = (input) => {
  if (input.substr(0,1)==="#") {
    const collen=(input.length-1)/3;
    const fact=[17,1,0.062272][collen-1];
    return [
        Math.round(parseInt(input.substr(1,collen),16)*fact),
        Math.round(parseInt(input.substr(1+collen,collen),16)*fact),
        Math.round(parseInt(input.substr(1+2*collen,collen),16)*fact)
    ];
  }
  return input.split("(")[1].split(")")[0].split(",").map(Math.round);
}

/**
 * Returns the position of the diverging bar based on the provided
 * value, range, and midpoint.
 * @param {number} value
 * @param {array} range
 * @param {number} midPoint 
 */
export const getPositionFromValue = (value, range = [-0.5, 0.5], midPoint = 0) => {
  if (!value && value !== 0) { return null; }
  const totalRange = range[1] - range[0];
  const targetRange = [ 
    (range[0] / totalRange) - midPoint, 
    (range[1] / totalRange) - midPoint 
  ];
  const scale = scaleLinear()
    .domain(range)
    .range(targetRange)
    .clamp(true);
  return scale(value);
}

export const titleCase = (str) => {
  return str.toLowerCase().split(' ').map(function(word) {
    return word.replace(word[0], word[0].toUpperCase());
  }).join(' ');
}