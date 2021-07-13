import { fade } from '@material-ui/core/styles/colorManipulator'
import * as merge from 'deepmerge'

import {
  getCSSVariable,
  formatNumber
} from '../../../shared/utils'

import {
  getDemographicFromVarName,
  getMetricFromVarName,
  getChoroplethColors,
  getMidpointForVarName,
  getFormatterForVarName,
  isVersusFromVarNames,
  isGapVarName,
  getMetricIdFromVarName,
  getPredictedValue
} from '../app/selectors'
import { getLang } from '../app/selectors/lang'
import { getDotSizeScale } from './selectors'
import { max, tickStep, ticks } from 'd3-array'
import { scaleLinear } from 'd3-scale'
import { getDataSubset } from '../../scatterplot/utils'
import { MAX_DOTS, PROGRESSIVE_THRESHOLD } from './constants'

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

const isDataReady = ({ data }) => data && data.length !== 0

/**
 *
 * @param {*} value
 * @param {*} metric metric to get key for (e.g. 'avg', 'avg_gap', 'grd', etc.)
 */
const getLangKeyForAxisLabel = (value, metric) => {
  const midPoint = metric.toLowerCase() === 'grd' ? 1 : 0
  const base = 'AXIS_' + metric.toUpperCase()
  const position =
    value === midPoint
      ? '_MID'
      : value > midPoint
      ? '_HIGH'
      : '_LOW'
  const single = value === 1 ? '_SINGLE' : ''
  return base + position + single
}

var STEPS = 6

const CUSTOM_AXIS_VARS = [
  'avg',
  'grd',
  'coh',
  'min',
  'ses',
  'seg',
  'frl'
]

/** GRID CONFIGURATION  */

export const grid = variant => {
  switch (variant) {
    case 'map':
      return {
        top: getCSSVariable('--sp-top'),
        right: getCSSVariable('--sp-right'),
        bottom: getCSSVariable('--sp-bottom'),
        left: getCSSVariable('--sp-left')
      }
    default:
      return {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
  }
}

/** SCATTERPLOT OVERLAY CONFIGURATION */

/**
 * Gets `series.markPoints` echart options based on an
 * array of points.
 * @param {array<{axis, x, y, label, options}>} points
 */
const getAxisLabels = points => {
  return {
    animation: false,
    silent: true,
    data: points
      .map(p => (p.axis ? getAxisLabel(p) : null))
      .filter(p => p)
  }
}

/**
 * Gets a point that falls on the x or y axis
 * @param {object} point
 */
const getAxisLabel = ({
  axis,
  x,
  y,
  label,
  labelStyle,
  options
}) => {
  const position =
    axis === 'y' ? { x: x, yAxis: y } : { y: y, xAxis: x }
  return {
    ...position,
    symbol: 'circle',
    symbolSize: 1,
    label: {
      formatter: '{val|' + label + '}',
      align: axis === 'y' ? 'right' : 'center',
      offset: axis === 'x' ? [0, 0] : [0, 0],
      rich: {
        val: {
          fontFamily:
            'maisonneue-book, lato, helvetica neue, Arial, sans-serif, -apple-system',
          fontSize: 11.7,
          fontWeight: 'normal',
          color: '#757575',
          borderWidth: 0,
          borderColor: 'rgba(0,0,0,0)',
          backgroundColor: '#fafafa',
          textBorderColor: 'transparent',
          textBorderWidth: 0,
          lineHeight: axis === 'y' ? 18 : 12
        }
      },
      ...labelStyle
    },
    ...options
  }
}

/**
 * Gets `series.markLine` echart options based on an
 * array of lines.
 * @param {array<{axis, position, style}>} lines
 */
const getAxisLines = lines => {
  return {
    animation: false,
    silent: true,
    data: lines
      .map(l => (l.axis ? getAxisLine(l) : null))
      .filter(l => l)
  }
}

/**
 * Gets line data that spans the graph on the x or y axis
 * @param {object} line
 */
const getAxisLine = ({
  axis = 'y',
  position = 0,
  lineStyle,
  start,
  end,
  midPoint = false
}) => {
  const startPosition =
    axis === 'y'
      ? { x: start || 0, yAxis: position }
      : { y: start || 0, xAxis: position }
  const endPosition =
    axis === 'y'
      ? { x: end || '100%', yAxis: position }
      : { y: end || '97%', xAxis: position }
  return [
    {
      ...startPosition,
      symbol: 'none',
      lineStyle: {
        color: midPoint ? '#888' : 'rgba(0,0,0,0.1)',
        type: 'solid',
        ...lineStyle
      }
    },
    {
      ...endPosition,
      symbol: 'none'
    }
  ]
}

/**
 * Returns an array of eCharts label objects for the provided positions
 * @param {array} positions
 * @param {string} langPrefix
 * @param {string} axis
 * @param {function} formatter
 */
const createLabels = (
  positions,
  langPrefix,
  axis = 'y',
  formatter = formatNumber,
  midPoint = 0
) => {
  const isMobile = window.innerWidth < 600
  return positions.map((pos, i) => {
    const isFirst = i === 0
    const isLast = i === positions.length - 1
    const isMidpoint = pos === midPoint
    const labelKey = getLangKeyForAxisLabel(pos, langPrefix)
    const value = '' + formatter(pos)
    const next =
      i + 1 < positions.length ? positions[i + 1] : null
    const isNextMidpoint = next === midPoint
    const prev = i > 0 ? positions[i - 1] : null
    const isPrevMidpoint = prev === midPoint
    // label if first, last, or midpoint
    // AND the next axis label is not the midpoint if mobile (prevent overlap)
    // AND the previous axis label is not the midpoint if mobile (prevent overlap)
    const shouldLabel =
      (isFirst || isLast || isMidpoint) &&
      !(isMobile && !isNextMidpoint) &&
      !(isMobile && !isPrevMidpoint)

    const label = shouldLabel
      ? getLang(labelKey, {
          value: value[0] === '-' ? value.substring(1) : value
        })
      : parseFloat(value) > parseFloat(midPoint)
      ? '+' + value
      : value
    return {
      value: axis === 'y' ? [0, pos] : [pos, 0],
      axis: axis,
      y: window.innerHeight > 700 ? '98%' : '97%',
      name: label,
      visualMap: false,
      midPoint: pos === midPoint
    }
  })
}

/**
 * Returns and array of eCharts line objects for provided positions
 * @param {*} positions
 * @param {*} axis
 */
const createLines = (positions, axis = 'y', midPoint) =>
  positions.map(position => ({
    axis,
    position,
    midPoint: position === midPoint
  }))

/**
 * Gets a echarts `series` containing any marked lines or
 * points for the graph.
 * @param {array} points
 * @param {array} lines
 */
const getOverlay = (points, lines) => {
  return {
    type: 'scatter',
    animation: false,
    silent: true,
    visualMap: false,
    data: points,
    symbolSize: 1,
    label: {
      show: false
    },
    zLevel: 1,
    markPoint: getAxisLabels(
      points.map(
        ({ axis = 'y', value, x, y, name, ...rest }) => ({
          axis,
          x: axis === 'y' ? x || '100%' : value[0],
          y: axis === 'y' ? value[1] : y || '100%',
          label: name,
          ...rest
        })
      )
    ),
    markLine: getAxisLines(lines)
  }
}

export const getBalancedExtent = (center, extent) => {
  const distance = extent.map(v => Math.abs(center - v))
  const maxDistance = max(distance)
  return [center - maxDistance, center + maxDistance]
}

const getIncrementForExtent = extent => {
  return tickStep(extent[0], extent[1], STEPS)
}

/**
 * Get the line and label overlays based on the variable name
 * @param {*} varName
 * @param {*} region
 */
const getOverlayForVarName = ({
  varName,
  axis = 'y',
  extent
}) => {
  const isGap = isGapVarName(varName)
  const metricId = getMetricIdFromVarName(varName)
  const midPoint = getMidpointForVarName(varName)
  const positions = ticks(extent[0], extent[1], STEPS)
  const langPrefix = isGap ? metricId + '_gap' : metricId
  const formatter = getFormatterForVarName(varName)
  const labels =
    CUSTOM_AXIS_VARS.indexOf(metricId) > -1
      ? createLabels(
          positions,
          langPrefix,
          axis,
          formatter,
          midPoint
        )
      : createLabels(
          [getMidpointForVarName(varName)],
          langPrefix,
          axis,
          formatter,
          midPoint
        )
  const lines = createLines(positions, axis, midPoint)
  return getOverlay(labels, lines)
}

const getPreviewOverlayForVarName = (varName, axis = 'y') => {
  if (varName.includes('frl')) {
    return getOverlay([], [])
  }
  const midPoint = getMidpointForVarName(varName)
  const positions = varName.includes('grd') ? [1] : [0]
  const lines = createLines(positions, axis, midPoint)
  const overlay = getOverlay([], lines)
  overlay.markLine.data = overlay.markLine.data.map(l => {
    return [
      {
        ...l[0],
        lineStyle: { color: '#888', type: 'solid', width: 2 }
      },
      l[1]
    ]
  })
  return overlay
}

const getOverlaysForContext = (
  variant,
  { xVar, yVar, region, extents }
) => {
  const overlays = []
  if (variant === 'map') {
    const xOverlays = getOverlayForVarName({
      varName: xVar,
      axis: 'x',
      region,
      extent: extents[0]
    })
    overlays.push(xOverlays)

    overlays.push(
      getOverlayForVarName({
        varName: yVar,
        axis: 'y',
        region,
        extent: extents[1]
      })
    )
    overlays.push(getVersusOverlay(xVar, yVar))
  }
  if (variant === 'preview') {
    overlays.push(getPreviewOverlayForVarName(xVar, 'x'))
    overlays.push(getPreviewOverlayForVarName(yVar, 'y'))
    overlays.push(getVersusOverlay(xVar, yVar))
  }
  return overlays
}

const overlays = (variant, context) => {
  return getOverlaysForContext(variant, context)
}

/** Return a series with a diagonal line */
const getVersusOverlay = (xVar, yVar) => {
  const isVs = isVersusFromVarNames(xVar, yVar)
  // return empty series if this is not a versus chart
  if (!isVs) {
    return {
      id: 'versus',
      type: 'line',
      data: [],
      markLine: { data: [], lineStyle: { color: 'transparent' } }
    }
  }
  // const xDem = getDemographicFromVarName(xVar)
  // const yDem = getDemographicFromVarName(yVar)
  // const metricId = getMetricIdFromVarName(xVar)
  // const [labelStart, labelEnd] = getLabelCoordsForMetric(
  //   metricId
  //   )
  return {
    id: 'versus',
    type: 'line',
    animation: false,
    silent: true,
    visualMap: false,
    data: [[-6, -6], [6, 6]],
    symbolSize: 0.1,
    zlevel: 100,
    z: 100,
    label: {
      show: false
    },
    lineStyle: {
      color: '#40B875',
      type: 'dotted',
      width: 2,
      opacity: 0.8
    }
  }
}

/** VISUAL MAP CONFIGURATION */

const COLORS = getChoroplethColors()

/** Returns chart colors based on variable names */
const getChartColorsFromVarNames = (xVar, yVar) => {
  const isVersus = isVersusFromVarNames(xVar, yVar)
  const isGap = isGapVarName(yVar)
  return isVersus
    ? ['#eee']
    : isGap
    ? [...COLORS].reverse()
    : COLORS
}

const getMapVisualMap = ({ xVar, yVar, colorExtent }) => {
  const range = colorExtent
  const colors = getChartColorsFromVarNames(xVar, yVar)

  return {
    type: 'continuous',
    min: range[0],
    max: range[1],
    inRange: {
      color: colors.map(c => fade(c, 0.9))
    },
    show: false,
    seriesIndex: 0,
    calculable: true,
    right: 0,
    bottom: 'auto',
    top: 'auto',
    left: 'auto',
    orient: 'vertical',
    itemHeight: 400,
    itemWidth: 24,
    precision: 1,
    contentColor: '#ff0000'
  }
}

const visualMap = (variant, options) => {
  switch (variant) {
    case 'map':
    case 'preview':
      return [getMapVisualMap(options)]
    default:
      return []
  }
}

/** X AXIS CONFIGURATION */

const getXAxis = ({ region, extent, ...rest }) => {
  const [min, max] = extent
  return {
    min,
    max,
    inverse: region === 'schools',
    axisLabel: { show: false },
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: {
      show: true,
      lineStyle: { type: 'solid', color: '#e4e4e4' }
    },
    ...rest
  }
}

const getMapXAxis = ({ varName, metric, region, extent }) => {
  const [min, max] = extent
  const formatter = getFormatterForVarName(varName)
  return {
    min,
    max,
    inverse: region === 'schools',
    axisLabel: {
      show: CUSTOM_AXIS_VARS.indexOf(metric.id) === -1,
      inside: false,
      formatter: formatter
    },
    axisLine: { show: false },
    axisTick: { show: false },
    interval: getIncrementForExtent(extent),
    nameGap: 0,
    nameTextStyle: {},
    splitLine: { show: false }
  }
}

const xAxis = ({ variant, varName, region, extent }) => {
  const metric = getMetricFromVarName(varName)
  const demographic = getDemographicFromVarName(varName)
  switch (variant) {
    case 'map':
      return getMapXAxis({
        varName,
        metric,
        demographic,
        region,
        extent
      })
    default:
      return getXAxis({
        varName,
        metric,
        demographic,
        region,
        extent
      })
  }
}

/** Y AXIS CONFIGURATION */

const getYAxis = ({ extent, ...rest }) => {
  const [min, max] = extent
  return {
    min,
    max,
    position: 'right',
    axisLabel: { show: false },
    axisLine: { show: false },
    splitLine: {
      show: true,
      lineStyle: { type: 'solid', color: '#e4e4e4' }
    },
    nameLocation: 'middle',
    ...rest
  }
}

const getMapYAxis = ({ region, extent, ...rest }) => {
  const [min, max] = extent
  return {
    min,
    max,
    position: 'right',
    axisLabel: {
      show: false,
      showMinLabel: false,
      showMaxLabel: false
    },
    axisLine: {
      show: region === 'schools' ? false : true,
      lineStyle: {
        color: '#888'
      }
    },
    axisTick: {
      show: false
    },
    splitLine: { show: false },
    ...rest
  }
}

const yAxis = ({ variant, region, extent }) => {
  switch (variant) {
    case 'map':
      return getMapYAxis({ extent, region })
    default:
      return getYAxis({ extent, region })
  }
}

export const getTrendLine = ({ yVar, extents, region }) => {
  // creates a trend line for SES relative to Y metric
  // NOTE: not used now, uncomment the line series below to add
  // eslint-disable-next-line
  function generateSesLine() {
    const stepCount = 400
    const metricId = getMetricIdFromVarName(yVar)
    const xExtent = extents[0]
    const xScale = scaleLinear()
      .domain([0, stepCount])
      .range(xExtent)

    let data = []
    for (let i = 0; i <= stepCount; i++) {
      let x = xScale(i)
      data.push([x, getPredictedValue(x, metricId, region)])
    }
    return data
  }
  // NOTE: uncomment the series below to add the trend line
  // trend line is development only feature for now, for testing
  // it is only accurate for "all" subgroup
  // ...(process.env.NODE_ENV === 'development'
  return {
    type: 'line',
    showSymbol: false,
    clip: true,
    data: generateSesLine(),
    lineStyle: {
      width: 1,
      type: 'dashed',
      color: 'rgba(0,0,0,0.5)'
    },
    z: 1000
  }
}

/**
 * Reduces the number of points in the dataset based on proximity
 */
const getReducedDataset = data => {
  // rounds to 2 decimals
  function round(number) {
    return Math.round(number * 100) / 100
  }
  const reducedData = data.reduce((obj, point) => {
    // create a key based on the dot position
    const key = round(point[0]) + ',' + round(point[1])
    // if there is no dot in this position, add it to the data set
    if (!obj[key]) {
      obj[key] = point
    }
    return obj
  }, {})
  return Object.values(reducedData)
}

/**
 * Gets the echart options for the underlay chart with grey dots
 * @param {*} param0
 * @param {*} base
 * @returns
 */
export const getUnderlayOptions = (
  { allData = [], xVar, yVar, zVar, extents },
  base
) => {
  const sizer = getDotSizeScale({
    extent: extents[2]
  })
  const underlayData = getReducedDataset(
    getDataSubset(allData, [xVar, yVar, zVar])
  )

  return {
    ...base,
    xAxis: {
      ...base.xAxis,
      splitLine: { show: false }
    },
    yAxis: {
      ...base.yAxis,
      splitLine: { show: false }
    },
    series: [
      {
        id: 'underlay',
        type: 'scatter',
        data: underlayData,
        symbolSize: value => sizer(value[2]),
        silent: true,
        zLevel: 1,
        itemStyle: {
          color: '#e0e0e0',
          borderWidth: 0
        }
      }
    ]
  }
}

/**
 * Gets the echart options for the main chart, with visual map, dot sizing, grid lines, axis labels, etc.
 * @param {*} variant
 * @param {*} param1
 * @param {*} base
 * @returns
 */
export const getOverlayOptions = (
  variant,
  { data = [], xVar, yVar, zVar, extents, colorExtent, region },
  base
) => {
  const sizer = getDotSizeScale({
    extent: extents[2]
  })
  const isVs = isVersusFromVarNames(xVar, yVar)
  const baseSeriesData = isDataReady({ data })
    ? getDataSubset(data, [xVar, yVar, zVar]).slice(0, MAX_DOTS)
    : []
  const options = {
    ...base,
    visualMap: visualMap(variant, {
      xVar,
      yVar,
      region,
      colorExtent
    }),
    series: [
      {
        id: 'base',
        type: 'scatter',
        data: baseSeriesData,
        silent: variant === 'preview',
        z: 100,
        itemStyle: {
          borderColor: isVs
            ? 'rgba(0,0,0,0.4)'
            : 'rgba(7,55,148,0.4)',
          borderWidth: 0.75
        },
        symbolSize: value => sizer(value[2]),
        progressiveThreshold: PROGRESSIVE_THRESHOLD,
        zLevel: 1
      },
      ...overlays(variant, {
        xVar,
        yVar,
        region,
        extents
      })
    ]
  }
  return extendScatterplotStyle(options)
}

/**
 * Returns an eCharts options object
 * @param {*} variant
 * @param {*} param1
 * @returns
 */
export const getScatterplotOptions = (variant, context = {}) => {
  if (!context.data || context.data.length === 0) return {}
  const { xVar, yVar, extents, region } = context
  const baseOptions = {
    grid: grid(variant),
    xAxis: xAxis({
      variant,
      varName: xVar,
      region,
      extent: extents[0]
    }),
    yAxis: yAxis({
      variant,
      varName: yVar,
      region,
      extent: extents[1]
    })
  }
  const overlayOptions = getOverlayOptions(
    variant,
    context,
    baseOptions
  )
  const underlayOptions = getUnderlayOptions(
    context,
    baseOptions
  )
  return [overlayOptions, underlayOptions]
}
