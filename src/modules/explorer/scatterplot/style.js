import { fade } from '@material-ui/core/styles/colorManipulator'

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
import { getScatterplotBaseOptions } from '../../scatterplot'
import { getLang } from '../app/selectors/lang'
import { getDotSizeScale } from './selectors'
import { max, tickStep, ticks } from 'd3-array'
import { scaleLinear } from 'd3-scale'

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

/** SERIES CONFIGURATION */

/**
 * Gets an echart series
 */
const getSeries = (seriesId, type, options) => ({
  id: seriesId,
  type: type,
  ...options
})

/**
 * Get the style overrides for the base series
 * @param {boolean} highlightedOn
 */
const getBaseSeries = ({ sizer, variant, xVar, yVar }) => {
  const isVs = isVersusFromVarNames(xVar, yVar)
  return getSeries('base', 'scatter', {
    silent: variant === 'preview',
    z: 100,
    itemStyle: {
      borderColor: isVs
        ? 'rgba(0,0,0,0.4)'
        : 'rgba(7,55,148,0.4)',
      borderWidth: 0.75
    },
    symbolSize: value => sizer(value[2])
  })
}

export const series = (seriesId, variant, options = {}) => {
  switch (seriesId) {
    case 'base':
      return getBaseSeries({ ...options, variant })
    // case 'highlighted':
    //   return getHighlightedSeries(options)
    default:
      return getSeries(seriesId, variant, options)
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
      : value > midPoint
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
    overlays.push(
      getOverlayForVarName({
        varName: xVar,
        axis: 'x',
        region,
        extent: extents[0]
      })
    )
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

/**
 * Returns an eCharts options object
 * @param {*} variant
 * @param {*} param1
 * @returns
 */
export const getScatterplotOptions = (
  variant,
  {
    data = [],
    allData = [],
    xVar,
    yVar,
    zVar,
    extents,
    colorExtent,
    region
  }
) => {
  if (!data || data.length === 0) return {}
  const sizer = getDotSizeScale({
    extent: extents[2]
  })
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

  const options = {
    grid: grid(variant),
    visualMap: visualMap(variant, {
      xVar,
      yVar,
      region,
      colorExtent
    }),
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
    }),
    series: [
      // series('underlay', variant, {
      //   symbolSize: 6,
      //   xVar,
      //   yVar
      // }),
      series('base', variant, {
        sizer,
        xVar,
        yVar
      }),
      ...overlays(variant, {
        xVar,
        yVar,
        region,
        extents
      })
      // NOTE: uncomment the series below to add the trend line
      // trend line is development only feature for now, for testing
      // it is only accurate for "all" subgroup
      // ...(process.env.NODE_ENV === 'development'
      //   ? [
      //       {
      //         type: 'line',
      //         showSymbol: false,
      //         clip: true,
      //         data: generateSesLine(),
      //         lineStyle: {
      //           width: 1,
      //           type: 'dashed',
      //           color: 'rgba(0,0,0,0.5)'
      //         },
      //         z: 1000
      //       }
      //     ]
      //   : [])
    ]
  }

  return getScatterplotBaseOptions({
    allData,
    data,
    xVar,
    yVar,
    zVar,
    selected: [],
    options
  })
}
