import * as merge from 'deepmerge'
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

const isDataReady = ({ data }) => data && data.length !== 0

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
    const zData = data.map(d => d[zVar])
    props.scale = zVar
      ? getDataScale(zData, { range: [6, 48] })
      : () => 10
  }
  const scatterData = zVar
    ? getDataSubset(data, [xVar, yVar, zVar])
    : getDataSubset(data, [xVar, yVar])
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