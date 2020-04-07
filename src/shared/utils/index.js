import { scaleLinear } from 'd3-scale'

/**
 * Gets a value between 0 and 1 depending on where the provided
 * value falls within the range
 * @param {*} value
 * @param {*} range
 * @param {*} invert
 */
export const getValuePositionInRange = (
  value,
  range,
  invert = false
) => {
  const [min, max] = range
  const pos = Math.min(
    1,
    Math.max(0, (value - min) / (max - min))
  )
  return invert ? 1 - pos : pos
}

export const genId = () =>
  '_' +
  Math.random()
    .toString(36)
    .substr(2, 9)

/**
 * Maps the data object to new keys based on the provided keyMap
 * @param {object} obj the object for which the keys should be mapped
 * @param {object} keyMap a map of { oldKey: newKey }
 * @returns {object} object containing the new keys in keyMap
 */
export const mapObjectKeys = (obj, keyMap) =>
  Object.keys(keyMap).reduce((acc, curr) => {
    if (obj[curr]) {
      acc[keyMap[curr]] = obj[curr]
    }
    return acc
  }, {})

/**
 * Returns keys that exist in the object
 */
export const getKeysInObject = (keys, obj = {}) =>
  keys.filter(k => obj.hasOwnProperty(k))

export const makeId = () =>
  '_' +
  Math.random()
    .toString(36)
    .substr(2, 9)

/**
 * Returns the value for a css variable
 * @param {*} varname
 */
export const getCSSVariable = varname =>
  // eslint-disable-next-line no-undef
  getComputedStyle(document.documentElement).getPropertyValue(
    varname
  )

/**
 * Returns the value rounded to the provided number of decimal
 * places.
 */
export const formatNumber = (val, options = {}) => {
  if (!val && val !== 0) {
    return 'N/A'
  }
  const factor = Math.pow(10, options.decimals || 2)
  const value = Math.round(val * factor) / factor
  return options.abs ? Math.abs(value) : value
}

/**
 * Returns a percent string
 * @param {number} v
 */
export const formatPercent = (v, options) => {
  if (!v && v !== 0) {
    return 'N/A'
  }
  return formatNumber(v * 100, options) + '%'
}

/**
 * Returns a percent string of how far the provided value
 * is from the provided `from` value. (used for learning rates)
 * @param {number} v the value to format
 * @param {number} from the point of reference to determine what the % diff is
 */
export const formatPercentDiff = (v, options = {}) => {
  const from = options.from || 1
  if (!v && v !== 0) {
    return 'N/A'
  }
  return formatPercent(v - from, options)
}

export const parseColor = input => {
  if (input.substr(0, 1) === '#') {
    const collen = (input.length - 1) / 3
    const fact = [17, 1, 0.062272][collen - 1]
    return [
      Math.round(parseInt(input.substr(1, collen), 16) * fact),
      Math.round(
        parseInt(input.substr(1 + collen, collen), 16) * fact
      ),
      Math.round(
        parseInt(input.substr(1 + 2 * collen, collen), 16) * fact
      )
    ]
  }
  return input
    .split('(')[1]
    .split(')')[0]
    .split(',')
    .map(Math.round)
}

/**
 * Returns the position of the diverging bar based on the provided
 * value, range, and midpoint.
 * @param {number} value
 * @param {array} range
 * @param {number} midPoint
 */
export const getPositionFromValue = (
  value,
  range = [-0.5, 0.5],
  midPoint = 0
) => {
  if (!value && value !== 0) {
    return null
  }
  const totalRange = range[1] - range[0]
  const targetRange = [
    range[0] / totalRange - midPoint,
    range[1] / totalRange - midPoint
  ]
  const scale = scaleLinear()
    .domain(range)
    .range(targetRange)
    .clamp(true)
  return scale(value)
}

export const titleCase = str => {
  return str
    .toLowerCase()
    .split(' ')
    .map(function(word) {
      return word.replace(word[0], word[0].toUpperCase())
    })
    .join(' ')
}

export const stripHtml = html => {
  var tmp = document.createElement('DIV')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

// Gets closest parent of element with selector
// https://gomakethings.com/how-to-get-the-closest-parent-element-with-a-matching-selector-using-vanilla-javascript/
export const getClosest = (elem, selector) => {
  // Element.matches() polyfill
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function(s) {
        var matches = (
            this.document || this.ownerDocument
          ).querySelectorAll(s),
          i = matches.length
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1
      }
  }

  // Get the closest matching element
  for (; elem && elem !== document; elem = elem.parentNode) {
    if (elem.matches(selector)) return elem
  }
  return null
}
