import axios from 'axios'
import { parse } from 'papaparse'

import {
  getColorForVarNameValue,
  getSelectedColors
} from '../app/selectors'

function FetchException(message, urls, err) {
  this.message = message
  this.name = 'FetchException'
  this.urls = urls
  this.originalError = err
}

/**
 *
 * @param {array} varNames e.g. [ 'id', 'all_avg', 'all_coh' ]
 * @param {object} data e.g { '01001': [ '01001', 3.22, 1.2 ], ... }
 * @returns {object} { 'all_avg': { '01001': 3.22, ... }, 'all_coh': { '01001': 3.22, ... }}
 */
const extractVarsFromDataArray = (varNames, data) => {
  return varNames.reduce((obj, v, i) => {
    if (v !== 'id') {
      obj[v] = Object.keys(data).reduce((a, c) => {
        if (data[c][i]) a[c] = data[c][i]
        return a
      }, {})
    }
    return obj
  }, {})
}

/**
 * Creates a collection with keys in `varNames` with associated data
 * @param {*} varNames e.g. [ 'w_ses', 'b_ses' ]
 * @param {*} data
 * @returns {object} { 'w_ses': { '01001': 0.43, ... }, 'b_ses': { '01001': 0.32, ... } }
 */
const createVariableCollection = (varNames, data, metaVars) => {
  if (!data || data.length === 0) {
    return {}
  }
  return varNames.reduce((acc, curr, i) => {
    if (curr === 'meta') {
      // extract variables from the "meta" file
      metaVars.forEach((v, j) => {
        if (j > 0) {
          acc[v] = Object.keys(data[i]).reduce((a, c) => {
            if (data[i][c][j]) a[c] = data[i][c][j]
            return a
          }, {})
        }
      })
    } else {
      acc[curr] = data[i]
    }
    return acc
  }, {})
}

/**
 * Parses a CSV string of scatterplot data.  Data is `string,number`
 * by default, except for if the data is from the meta file. The meta file
 * is formatted as `string,string,number,number,number,number,number`
 * @param {*} data
 * @param {string} varName the name of the variable being parsed
 */
const parseCsvData = (data, isMeta) => {
  // parse CSV data
  const parsed = parse(data, {
    transform: (value, column) => {
      return ((isMeta && column > 1) ||
        (!isMeta && column > 0)) &&
        (value || value === 0) &&
        !isNaN(parseFloat(value))
        ? parseFloat(value)
        : value
    }
  })
  if (parsed.errors.length) {
    const errorMessage =
      parsed.errors[0].type +
      ':' +
      parsed.errors[0].code +
      ' on row ' +
      parsed.errors[0].row
    throw new Error(errorMessage)
  }
  // reduce array of data into an object
  // e.g. { '0100001': 2.44, ... }
  return {
    header: parsed.data[0],
    data: parsed.data.reduce((acc, curr) => {
      // skip header row
      if (curr[0] !== 'id') {
        acc[curr[0]] = curr.length === 2 ? curr[1] : curr
      }
      return acc
    }, {})
  }
}

/**
 * Gets the data url to the provided prefix, varName, state
 * @param {string} endpoint endpoint for where the scatterplot data lives
 * @param {string} prefix data prefix or region (e.g. 'counties')
 * @param {string} varName the variable name to use
 * @param {string} state the state to fetch data, used for schools only (e.g. 01)
 */
const getDataUrlForVarName = (
  endpoint,
  prefix,
  varName,
  state
) => {
  if (prefix === 'schools') {
    if (state) {
      return varName === 'meta'
        ? `${endpoint}meta/schools/${state}.csv`
        : `${endpoint}schools/${state}/${varName}.csv`
    }
  } else {
    return varName === 'meta'
      ? `${endpoint}meta/${prefix}.csv`
      : `${endpoint}${prefix ? prefix + '/' : ''}${varName}.csv`
  }
}

/**
 * Fetches the data for a x / y pair for schools
 * @param {string} endpoint endpoint for where the scatterplot data lives
 * @param {string} var1
 * @param {string} var2
 */
export const fetchReducedPair = (endpoint, var1, var2) => {
  const filename = [var1, var2].sort().join('-')
  const fetchUrl = `${endpoint}schools/reduced/${filename}.csv`
  return axios
    .get(fetchUrl)
    .then(res => parseCsvData(res.data, true))
    .then(({ header, data }) =>
      extractVarsFromDataArray(header, data)
    )
    .catch(err => {
      throw new FetchException(
        `Could not fetch data`,
        { [filename]: fetchUrl },
        err
      )
    })
}

/**
 * Fetches data and returns a promise that contains
 * an array of all the requested vars data on success.
 * @param {Array<String>} vars array of variable names to fetch (e.g. [ 'all_avg', 'all_ses' ])
 * @param {string} prefix prefix to the varname to fetch (e.g. 'districts')
 * @returns {Promise<object>}
 */
export const fetchScatterplotVars = (
  vars = [],
  prefix,
  endpoint,
  metaVars = [],
  state
) => {
  const fetchVars = vars
    .map(v => (metaVars.indexOf(v) > -1 ? 'meta' : v))
    .filter(
      (value, index, self) => self.indexOf(value) === index
    )
  const fetchUrls = fetchVars.map(v =>
    getDataUrlForVarName(endpoint, prefix, v, state)
  )
  const fetchMap = fetchVars.reduce((acc, curr, i) => {
    if (fetchUrls[i]) {
      acc[curr] = fetchUrls[i]
    }
    return acc
  }, {})
  return Promise.all(
    Object.keys(fetchMap).map(v =>
      axios.get(fetchMap[v]).then(
        res => {
          return parseCsvData(res.data, v === 'meta').data
        },
        err => {
          throw new FetchException(
            `Could not fetch data`,
            fetchMap,
            err
          )
        }
      )
    )
  ).then(data =>
    createVariableCollection(fetchVars, data, metaVars)
  )
}

/** Helper to grab location ID from chart events */
export const getLocatonIdFromEvent = e => {
  // index of the id property in the scatterplot data
  const idIndex = 3
  // get the data array for the hovered location
  const hoverData =
    e && e.data && e.data.hasOwnProperty('value')
      ? e.data['value']
      : e.data
  const id = hoverData ? hoverData[idIndex] : null
  // get the data from the state for the location
  return id
}

/**
 * Helper to grab event coordinates from chart events
 * @param {*} e event
 * @returns {[number, number]} [x, y]
 */
export const getCoordsFromEvent = e => [
  e.event.event.pageX,
  e.event.event.pageY
]

/**
 * Checks if the event has a marker as a related event
 * @param {*} e
 */
export const isMarkerRelated = e => {
  return !e.event.event.relatedTarget
    ? false
    : !e.event.event.relatedTarget.classList.contains('marker')
}

/** checks if value is present */
export const hasVal = val => val || val === 0

/**
 * Returns object with position and size of a circle for a feature
 */
export const getCircle = ({
  xVar,
  yVar,
  zVar,
  xValueToPercent,
  yValueToPercent,
  zValueToRadius,
  data,
  region,
  index,
  ...props
}) => {
  const MIN_OVERLAY_SIZE = 8
  if (!data) {
    return null
  }
  const xVal = data[xVar]
  const yVal = data[yVar]
  const zVal = data[zVar]
  return {
    id: data.id,
    x:
      xValueToPercent && hasVal(xVal)
        ? xValueToPercent(xVal) + '%'
        : null,
    y:
      yValueToPercent && hasVal(yVal)
        ? yValueToPercent(yVal) + '%'
        : null,
    z:
      zValueToRadius && hasVal(zVal)
        ? Math.max(MIN_OVERLAY_SIZE, zValueToRadius(zVal))
        : MIN_OVERLAY_SIZE,
    outerColor: hasVal(index)
      ? getSelectedColors()[index]
      : '#f00',
    label: hasVal(index) ? index + 1 : '',
    innerColor: getColorForVarNameValue(
      data[yVar],
      yVar,
      region
    ),
    data: data,
    ...props
  }
}

/**
 * Returns an array of circle data for the provided features
 */
export const getCircles = ({ data, ...props }) => {
  if (!data) return {}
  // add circles for selected items
  return data
    .filter(f => !!f)
    .map((d, i) => getCircle({ data: d, index: i, ...props }))
}

/**
 * Returns a percent based on where the value falls
 * within the range
 * @param {number} value
 * @param {array<number>} range
 */
export const getValuePercentInRange = (
  value,
  range,
  invert = false
) => {
  const percent =
    ((value - range[0]) / (range[1] - range[0])) * 100
  return invert ? 100 - percent : percent
}
