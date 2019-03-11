import axios from 'axios';
import { parse } from 'papaparse';
import * as scale from 'd3-scale';
import * as d3array from 'd3-array';

// load endpoint from env variable or use fallback
const endpoint = process.env.REACT_APP_VARS_ENDPOINT ||
  'http://seda-data.s3-website-us-east-1.amazonaws.com/build/dev/scatterplot/';

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
    d3array.quantile(values, 0.001), 
    d3array.quantile(values, 0.999)
  ]
}

/**
 * Takes multiple data sets with identifiers and merges them
 * into one for use with echarts scatterplot. Filters out 
 * entries where there are not values in all data sets.
 * @param {object} sets a variable amount of data sets - e.g. { "01001": 3.45, ... }
 * @returns {object} e.g. { "01001": [ 3.45, 5.10, 01001 ], ... }
 */
const mergeDatasets = (...sets) => {
  // filter out IDs that are not common to all sets
  const ids = Object.keys(sets[0]).filter(id =>
    sets.reduce((acc, curr) =>
      acc ? 
        curr.hasOwnProperty(id) && 
        parseFloat(curr[id]) > -9999 &&
        parseFloat(curr[id]) > -9999 &&
        id !== "" && id !== "id"
        : false
    , true)
  )
  // create an object with all merged data
  const merged = ids.reduce(
    (acc, curr) => {
      acc[curr] = [
        ...sets.map(s => parseFloat(s[curr])),
        curr
      ]
      return acc;
    }, {}
  )
  return merged;
}

const baseVars = ['id', 'name', 'lat', 'lon', 'all_ses', 'all_avg', 'sz' ];

/**
 * Fetches data and returns a promise that contains 
 * an array of all the requested vars data on success.
 * @param {Array<String>} vars array of variable names to fetch (e.g. [ 'all_avg', 'all_ses' ])
 * @param {string} region region to fetch (e.g. 'districts')
 * @returns {Promise<object>}
 */
export const fetchVarsFromCSV = (vars = [], region) => {
  const fetchVars = vars
    .map(v => baseVars.indexOf(v) > -1 ? 'base' : v)
    .filter((value, index, self) => self.indexOf(value) === index)
  return Promise.all(
    fetchVars
      .map(v => axios
        .get(`${endpoint}${region}-${v}.csv`)
        .then((res) => {
          // parse CSV data
          console.time(`parsing ${v} csv`);
          const parsed = parse(res.data, {
            transform: (value, column) => {
              return (
                (v === 'base' && column > 1) ||
                (v !== 'base' && column > 0)
               ) && (value || value === 0) ?
                  parseFloat(value) :
                  value
            }
          });
          console.timeEnd(`parsing ${v} csv`);
          if (parsed.errors.length) {
            throw new Error(res.errors[0])
          }
          // reduce array of data into an object
          // e.g. { '0100001': 2.44, ... }
          return parsed.data.reduce((acc, curr) => {
            acc[curr[0]] = curr.length === 2 ? curr[1] : curr;
            return acc;
          }, {});
        })
      )
  )
  // take the data for all fetched variables and combine
  // into an object based on variable key
  // (e.g. { 'all_avg': { '0100001': 2.44, ... } })
  .then(data => {
    console.time('structure parsed csv data')
    const newData = fetchVars.reduce((acc, curr, i) => {
      if (curr === 'base') {
        baseVars.forEach((v,j) => {
          if(j > 0) {
            acc[v] = Object.keys(data[i])
              .reduce((a, c) => {
                if (data[i][c][j])
                  a[c] = data[i][c][j]
                return a;
              }, {})
          }  
        })
      } else {
        acc[curr] = data[i];
      }
      return acc;
    }, {})
    console.timeEnd('structure parsed csv data')
    return newData;
})
}


/**
 * Checks if a property of two objects are equal
 */
export const isPropEqual = (obj1, obj2, propName) => {
  if (!obj1 && !obj2) { return true; }
  if (obj1 && !obj2) { return false; }
  if (!obj1 && obj2) { return false; }
  return (obj1.hasOwnProperty(propName) && 
          obj2.hasOwnProperty(propName) &&
          obj1[propName] === obj2[propName])
}

/**
 * Returns provided datasets merged into an array that
 * can be used with eCharts data series.
 * @param  {...any} sets a variable number of data sets (e.g { '0100001' : 2.44, ... })
 */
export const getScatterplotData = (...sets) => {
  if (sets.length < 1) {
    throw new Error('Cannot create scatterplot data with less than two variables')
  }
  const merged = mergeDatasets(...sets);
  return Object.keys(merged).map(k => merged[k])
}

/**
 * Gets the region that corresponds to the provided ID
 * @param {string} id 
 */
export const getRegionFromId = (id) => {
  const idLengths = {
    5: 'counties',
    7: 'districts',
    12: 'schools'
  }
  if (!idLengths[id.length]) {
    throw new Error('No region corresponding to provided ID');
  }
  return idLengths[id.length]
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
  if (!data) { return () => 0 }
  return scale.scalePow()
    .exponent(exponent)
    .domain(getDataRange(data))
    .range(range)
    .clamp(true);
}