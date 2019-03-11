import * as merge from 'lodash.merge';
import axios from 'axios';
import { parse } from 'papaparse';

// load endpoint from env variable or use fallback
const endpoint = process.env.REACT_APP_VARS_ENDPOINT ||
  'http://seda-data.s3-website-us-east-1.amazonaws.com/build/dev/scatterplot/';

const baseVars = ['id', 'name', 'lat', 'lon', 'all_ses', 'all_avg', 'sz' ];


/** Default options for scatterplot container */
const containerOptions = {
  top: '24',
  right: '24',
  bottom: '24',
  left: '24',
};

/** Default options for x axis */
const xAxisOptions = {
  type: 'value',
  name: '',
  interval: 1,
  nameTextStyle: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  nameLocation: 'center',
  nameGap: 16,
  splitLine: {
    show: false,
  },
  axisLine: {
    show: false
  },
  axisTick: {
    show: false
  }
}

/** Default options for y axis */
const yAxisOptions = {
  type: 'value',
  name: '',
  splitLine: {
    show: true,
    lineStyle: {
      type: 'dashed',
      color: [ 'rgba(0,0,0,0.1)']
    },
  },
  axisTick: {
    show: false
  },
  axisLine: {
    show: false
  },
  axisLabel: {
    inside: false,
    textVerticalAlign: 'middle',
    showMaxLabel: true,
    showMinLabel: true,
    color: '#999',
    fontSize: 12
  }
};

/** Default options for data series */
const seriesOptions = {
  type: 'scatter',
  itemStyle: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)'
  },
  z:2
}

/** Default options for visual map */
const visualMapOptions = {
  dimension: 1,
  calculable: false,
  show: false,
};

/**
 * Merge data series overrides with default options
 * @param {object} overrides https://ecomfe.github.io/echarts-doc/public/en/option.html#series-scatter
 */
const getScatterSeries = (overrides = {}) => 
  merge(
    {},
    seriesOptions,
    overrides
  )

/**
 * Merge axis overrides with default axis options
 * @param {string} axisName 'x' or 'y'
 * @param {object} overrides https://ecomfe.github.io/echarts-doc/public/en/option.html#xAxis
 */
const getAxisOptions = (axisName, overrides = {}) =>
  merge(
    {},
    axisName === 'x' ? xAxisOptions : yAxisOptions,
    overrides
  );

/**
 * Merge container overrides with default container options
 * @param {object} overrides https://ecomfe.github.io/echarts-doc/public/en/option.html#grid
 */
const getContainerOptions = (overrides = {}) =>
  merge(
    {},
    containerOptions,
    overrides
  );

/**
 * Merge visual map overrides with default visual map options
 * @param {object} overrides https://ecomfe.github.io/echarts-doc/public/en/option.html#visualMap
 */
const getVisualMapOptions = (overrides = []) =>
  overrides.map((vm) => merge(
    {},
    visualMapOptions,
    vm
  ))

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

/**
 * Fetches data and returns a promise that contains 
 * an array of all the requested vars data on success.
 * @param {Array<String>} vars array of variable names to fetch (e.g. [ 'all_avg', 'all_ses' ])
 * @param {string} region region to fetch (e.g. 'districts')
 * @returns {Promise<object>}
 */
export const fetchScatterplotVars = (vars = [], region) => {
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
 * Gets the base scatterplot config with the provided overrides
 * @param {*} overrides any override options for the scatterplot
 */
export const getScatterplotConfig = (overrides = {}) => ({
  ...overrides,
  grid: getContainerOptions(overrides.grid),
  xAxis: getAxisOptions('x', overrides.xAxis),
  yAxis: getAxisOptions('y', overrides.yAxis),
  visualMap: getVisualMapOptions(overrides.visualMap),
  series: (overrides.series || [])
    .map(d => getScatterSeries(d))
})

