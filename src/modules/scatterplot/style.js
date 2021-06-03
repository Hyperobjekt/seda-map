import * as merge from 'deepmerge'
import {
  MAX_DOTS,
  PROGRESSIVE_THRESHOLD,
  UNDERLAY_THRESHOLD
} from '../explorer/scatterplot/constants'
import { getDataScale, getDataSubset } from './utils'

/** Default options for scatterplot container */
const gridOptions = {
  top: '24',
  right: '24',
  bottom: '24',
  left: '24'
}

/** Default options for x axis */
const xAxisOptions = {
  type: 'value',
  interval: 1,
  nameTextStyle: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  nameLocation: 'center',
  nameGap: 16,
  splitLine: {
    show: false
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
  splitLine: {
    show: true,
    lineStyle: {
      type: 'dashed',
      color: ['rgba(0,0,0,0.1)']
    }
  },
  axisTick: {
    show: false
  },
  axisLine: {
    show: false
  }
}

/** Default options for visual map */
const visualMapOptions = {
  dimension: 1,
  calculable: false,
  show: false
}

/**
 * Merge axis overrides with default axis options
 * @param {string} axisName 'x' or 'y'
 * @param {object} overrides https://ecomfe.github.io/echarts-doc/public/en/option.html#xAxis
 */
const getAxisOptions = (axisName, overrides = {}) =>
  merge(
    axisName === 'x' ? xAxisOptions : yAxisOptions,
    overrides
  )

/**
 * Merge container overrides with default container options
 * @param {object} overrides https://ecomfe.github.io/echarts-doc/public/en/option.html#grid
 */
const getGridOptions = (overrides = {}) =>
  merge(gridOptions, overrides)

/**
 * Merge visual map overrides with default visual map options
 * @param {object} overrides https://ecomfe.github.io/echarts-doc/public/en/option.html#visualMap
 */
const getVisualMapOptions = (overrides = []) =>
  overrides.map(vm => merge(visualMapOptions, vm))

/**
 * Gets the base scatterplot config with the provided overrides
 * @param {*} overrides any override options for the scatterplot
 */
const extendScatterplotStyle = (overrides = {}) => ({
  ...overrides,
  grid: getGridOptions(overrides.grid),
  xAxis: getAxisOptions('x', overrides.xAxis),
  yAxis: getAxisOptions('y', overrides.yAxis),
  visualMap: getVisualMapOptions(overrides.visualMap)
})

/**
 * Gets a data series with selected items
 */
const getUnderlaySeries = ({ scatterData }) => {
  // data index for the id property
  const baseSeries = {
    id: 'underlay',
    type: 'scatter',
    symbolSize: 10,
    // progressive: 5000, // setting to 0 makes performance worse, but fixes issues with lots of re-rendering
    progressiveThreshold: PROGRESSIVE_THRESHOLD,
    zLevel: 1,
    visualMap: false,
    // large: true, // commented out, causes performance issues
    silent: true,
    itemStyle: {
      borderColor: 'transparent',
      color: '#ddd'
    }
  }
  return { ...baseSeries, data: scatterData }
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
      progressiveThreshold: PROGRESSIVE_THRESHOLD,
      symbolSize: value => scale(value[2]),
      zLevel: 1
    },
    overrides ? overrides : {}
  )
  return series
}

const getDataSeries = (id, series = []) =>
  series && series.length ? series.find(s => s.id === id) : null

const isDataReady = ({ data }) => data && data.length !== 0

const getSeriesSubset = (series, ids) => {
  return series
    .filter(d => ids.indexOf(d[3]) > -1)
    .slice(0, MAX_DOTS)
}

/**
 * Gets scatterplot data series, or return empty array if
 * data is not ready yet
 */
const getScatterplotSeries = props => {
  const { allData, data, xVar, yVar, zVar, options } = props

  // pull out series that are not 'base' or 'underlay'
  const otherSeries =
    options && options.series
      ? options.series.filter(s => ['base'].indexOf(s.id) === -1)
      : []

  // if there is no scale, create one based on zVar (for sizing)
  if (!props.scale) {
    const zData = data.map(d => d[zVar])
    props.scale = zVar
      ? getDataScale(zData, { range: [6, 48] })
      : () => 10
  }

  // get the scatterplot data series, depending on if there is an underlay or not
  const allScatterData = zVar
    ? getDataSubset(data, [xVar, yVar, zVar])
    : getDataSubset(data, [xVar, yVar])
  const mainDataSeries = allScatterData

  // return an array of series with appropriate data sources
  const series = [
    getBaseSeries({
      scatterData: mainDataSeries.slice(0, MAX_DOTS),
      ...props
    }),
    ...otherSeries
  ]
  return series
}

/**
 * Gets the options with overrides and series data for the scatterplot
 */
export const getScatterplotBaseOptions = props => {
  const series = isDataReady(props)
    ? getScatterplotSeries(props)
    : []
  const options = {
    ...props.options,
    series
  }
  return extendScatterplotStyle(options)
}
