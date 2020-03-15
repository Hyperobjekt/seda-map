import axios from 'axios'
import { parse } from 'papaparse'
import * as scale from 'd3-scale'
import * as d3array from 'd3-array'
import * as merge from 'deepmerge'
import { extendScatterplotStyle } from './style'
import { getStateAbbr } from '../../../../shared/selectors/states'

function FetchException(message, urls, err) {
  this.message = message
  this.name = 'FetchException'
  this.urls = urls
  this.originalError = err
}

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

/**
 * Gets an echart series for all of the data corresponding to IDs
 * in `props.highlighted`
 * @param {array} scatterData data from the base series
 * @param {function} sizeScale a function that returns circle size based on zVar
 */
const getHighlightedSeries = ({
  scatterData,
  scale,
  highlighted = [],
  options,
  zVar
}) => {
  // data index for the id property
  const idDim = zVar ? 3 : 2
  const baseSeries = {
    id: 'highlighted',
    type: 'scatter',
    symbolSize: zVar ? value => scale(value[2]) : 10,
    zLevel: 3
  }
  const overrides = options
    ? getDataSeries('highlighted', options.series)
    : {}
  const data = highlighted
    .map((id, i) => scatterData.find(d => d[idDim] === id))
    .filter(d => Boolean(d))
  return merge(
    { ...baseSeries, data },
    overrides ? overrides : {}
  )
}

/**
 * Gets a data series with selected items
 */
const getSelectedSeries = ({
  scatterData,
  scale,
  selected = [],
  options,
  zVar
}) => {
  // data index for the id property
  const idDim = zVar ? 3 : 2
  const baseSeries = {
    id: 'selected',
    type: 'scatter',
    symbolSize: value => scale(value[2]),
    zLevel: 4
  }
  const overrides = options
    ? getDataSeries('selected', options.series)
    : {}
  const data = selected
    .map((id, i) => scatterData.find(d => d[idDim] === id))
    .filter(d => Boolean(d))
  return merge(
    { ...baseSeries, data: data },
    overrides ? overrides : {}
  )
}

/**
 * Get series with default styles and selected highlights
 */
const getBaseSeries = ({ scatterData, scale, options }) => {
  const overrides = options
    ? getDataSeries('base', options.series)
    : {}
  const series = merge(
    {
      id: 'base',
      type: 'scatter',
      data: scatterData,
      symbolSize: value => scale(value[2]),
      zLevel: 2
    },
    overrides ? overrides : {}
  )
  return series
}

const getDataSeries = (id, series = []) =>
  series && series.length ? series.find(s => s.id === id) : null

const isDataReady = ({ data, xVar, yVar, zVar }) =>
  data &&
  data[xVar] &&
  data[yVar] &&
  ((zVar && data[zVar]) || !zVar)

/**
 * Gets scatterplot data series, or return empty array if
 * data is not ready yet
 */
const getScatterplotSeries = props => {
  const { data, xVar, yVar, zVar, options } = props
  const otherSeries =
    options && options.series
      ? options.series.filter(
          s =>
            ['base', 'selected', 'highlighted'].indexOf(s.id) ===
            -1
        )
      : []
  if (!props.scale) {
    props.scale = zVar
      ? getDataScale(data[zVar], { range: [6, 48] })
      : () => 10
  }
  const scatterData = zVar
    ? getScatterplotData(data[xVar], data[yVar], data[zVar])
    : getScatterplotData(data[xVar], data[yVar])
  const params = { scatterData, ...props }
  const series = [
    getBaseSeries(params),
    getSelectedSeries(params),
    getHighlightedSeries(params),
    ...otherSeries
  ]
  return series
}

/**
 * Gets the options with overrides and series data for the scatterplot
 */
export const getScatterplotOptions = props => {
  const series = isDataReady(props)
    ? getScatterplotSeries(props)
    : []
  const options = {
    ...props.options,
    series
  }
  return extendScatterplotStyle(options)
}

/**
 * Gets the scatterplot data for a given ID
 * @param {*} id
 * @param {*} data
 */
export const getDataForId = (id, data) => {
  return Object.keys(data).reduce(
    (acc, curr) => {
      // only add data if it exists
      if (data[curr][id] || data[curr][id] === 0) {
        acc[curr] = data[curr][id]
      }
      return acc
    },
    { id, state: getStateAbbr(id) }
  )
}

export const getFeatureForId = (id, data) => {
  return {
    id,
    properties: getDataForId(id, data)
  }
}
