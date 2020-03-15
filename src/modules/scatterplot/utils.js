import { fade } from '@material-ui/core/styles/colorManipulator'
import {
  getSizerFunctionForRegion,
  isGapVarName,
  getDemographicFromVarName,
  getMetricIdFromVarName,
  getMetricFromVarName,
  getChoroplethColors,
  getMetricRangeFromVarName,
  getMidpointForVarName,
  isVersusFromVarNames,
  getDemographicForVarNames,
  getFormatterForVarName
} from '../../shared/selectors'
import { getLang } from '../../shared/selectors/lang'
import { getCSSVariable, formatNumber } from '../../shared/utils'
import { getScatterplotOptions as getScatterplotBaseOptions } from './components/ScatterplotBase/utils'

/** UTILS */

/** Returns an amount for how much to increment each step for the axis overlay */
const getIncrementForVarName = (varName, region) => {
  const metricId = getMetricIdFromVarName(varName)
  const isGap = isGapVarName(varName)
  const key = metricId + (isGap ? '_gap' : '')
  switch (key) {
    case 'avg':
      return region === 'schools' ? 2 : 1
    case 'grd':
      return region === 'schools' ? 0.4 : 0.2
    case 'coh':
      return region === 'schools' ? 0.25 : 0.2
    case 'frl':
      return 0.25
    case 'coh_gap':
    case 'grd_gap':
      return 0.1
    case 'ses_gap':
      return 1
    case 'seg':
    case 'seg_gap':
      return 0.25
    case 'min':
    case 'min_gap':
      return 0.2
    default:
      return 1
  }
}

/**
 * Returns an array with an equal number of lines
 * above / below a provided center, with a provided
 * increment.
 * @param {number} num length of the returned array (must be odd)
 * @param {number} inc amount to increment for each step
 * @param {number} center the center point of the array
 */
const getPositionArray = (count, inc, center = 0, range) => {
  // numLines must be odd so it is balanced above / below axis
  if (count % 2 === 0) {
    count = count - 1
  }
  const offset = (count - 1) / 2
  return new Array(count)
    .fill()
    .map((v, i) => (i - offset) * inc + center)
    .filter(v =>
      range && range.length === 2
        ? v > range[0] && v < range[1]
        : true
    )
}

const isStateHighlighed = highlightedState =>
  highlightedState && highlightedState !== 'us'

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
        top: getCSSVariable('--sp-prev-top'),
        right: getCSSVariable('--sp-prev-right'),
        bottom: getCSSVariable('--sp-prev-bottom'),
        left: getCSSVariable('--sp-prev-left')
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
const getBaseSeries = ({ highlightedState, sizer, variant }) => {
  const hl = isStateHighlighed(highlightedState)
  return getSeries('base', 'scatter', {
    silent: hl || variant === 'preview',
    z: 100,
    itemStyle: {
      color: hl ? '#e6e6e6' : '#ff0000',
      borderColor: hl ? 'transparent' : 'rgba(7,55,148,0.4)',
      borderWidth: hl ? 0 : 0.75
    },
    symbolSize: hl ? 6 : value => sizer(value[2])
  })
}

/**
 * Get the style overrides for the highlight series
 */
const getHighlightedSeries = ({ highlightedState, sizer }) =>
  getSeries('highlighted', 'scatter', {
    show: isStateHighlighed(highlightedState),
    z: 101,
    itemStyle: {
      borderColor: 'rgba(7,55,148,0.666)',
      borderWidth: 1
    },
    symbolSize: value => sizer(value[2])
  })

export const series = (seriesId, variant, options = {}) => {
  switch (seriesId) {
    case 'base':
      return getBaseSeries({ ...options, variant })
    case 'highlighted':
      return getHighlightedSeries(options)
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
          backgroundColor: 'rgba(255,255,255,1)',
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
      : { y: end || '100%', xAxis: position }
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
) =>
  positions.map((pos, i) => {
    const isFirst = i === 0
    const isLast = i === positions.length - 1
    const isMidpoint = pos === midPoint
    const labelKey = getLangKeyForAxisLabel(pos, langPrefix)
    const value = '' + formatter(pos)
    const label =
      isFirst || isLast || isMidpoint
        ? getLang(labelKey, {
            value: value[0] === '-' ? value.substring(1) : value
          })
        : value > midPoint
        ? '+' + value
        : value
    return {
      value: axis === 'y' ? [0, pos] : [pos, 0],
      axis: axis,
      y: '97%',
      name: label,
      visualMap: false,

      midPoint: pos === midPoint
    }
  })

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

/**
 * Get the line and label overlays based on the variable name
 * @param {*} varName
 * @param {*} region
 */
const getOverlayForVarName = (varName, axis = 'y', region) => {
  const isGap = isGapVarName(varName)
  const metricId = getMetricIdFromVarName(varName)
  const numLines = 9
  const inc = getIncrementForVarName(varName, region)
  const midPoint = getMidpointForVarName(varName)
  const range = getMetricRangeFromVarName(varName, region)
  const positions = getPositionArray(
    numLines,
    inc,
    midPoint,
    range
  )
  const langPrefix = isGap ? metricId + '_gap' : metricId
  const formatter = getFormatterForVarName(varName)
  const labels =
    ['avg', 'grd', 'coh', 'min'].indexOf(metricId) > -1
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
  const labels = createLabels(
    positions,
    'PREV',
    axis,
    undefined,
    midPoint
  )
  const lines = createLines(positions, axis, midPoint).map(
    l => ({
      ...l,
      start: 8
    })
  )
  return getOverlay(labels, lines)
}

const getOverlaysForContext = (
  variant,
  { xVar, yVar, region }
) => {
  const overlays = []
  if (variant === 'map') {
    overlays.push(getOverlayForVarName(xVar, 'x', region))
    overlays.push(getOverlayForVarName(yVar, 'y', region))
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

/**
 * Returns where to place the diagonal line label
 * for the provided metric
 */
const getLabelCoordsForMetric = metricId => {
  switch (metricId) {
    case 'avg':
      return [[-3, -3], [-2, -2]]
    case 'grd':
      return [[0.5, 0.5], [0.7, 0.7]]
    case 'coh':
      return [[-0.3, -0.3], [-0.4, -0.4]]
    default:
      return [[-0.1, -0.1], [0.1, 0.1]]
  }
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
  const xDem = getDemographicFromVarName(xVar)
  const yDem = getDemographicFromVarName(yVar)
  const metricId = getMetricIdFromVarName(xVar)
  const [labelStart, labelEnd] = getLabelCoordsForMetric(
    metricId
  )
  return {
    id: 'versus',
    type: 'line',
    animation: false,
    silent: true,
    visualMap: false,
    data: [[-6, -6], [6, 6]],
    symbolSize: 0.1,
    zLevel: 100,
    label: {
      show: false
    },
    itemStyle: {
      color: '#999'
    },
    markLine: {
      animation: false,
      silent: true,
      zLevel: 100,
      label: {
        position: 'middle',
        formatter: function(value) {
          return value.name
        }
      },
      lineStyle: {
        width: 0,
        color: '#000'
      },
      data: [
        [
          {
            coord: labelStart,
            symbol: 'none'
          },
          {
            coord: labelEnd,
            symbol: 'none',
            zLevel: 100,
            name: getLang('LINE_EQUAL_OPPORTUNITY', {
              demographic1: getLang('LABEL_' + xDem.id),
              demographic2: getLang('LABEL_' + yDem.id)
            })
          }
        ]
      ]
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

const getMapVisualMap = ({
  xVar,
  yVar,
  highlightedState,
  region
}) => {
  const range = getMetricRangeFromVarName(yVar, region, 'map')
  const colors = getChartColorsFromVarNames(xVar, yVar)
  return {
    type: 'continuous',
    min: range[0],
    max: range[1],
    inRange: {
      color: colors.map(c => fade(c, 0.9))
    },
    show: false,
    seriesIndex: isStateHighlighed(highlightedState) ? 2 : 0,
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

const getXAxis = ({ metric, demographic, region, ...rest }) => {
  const [min, max] = getMetricRangeFromVarName(
    [demographic.id, metric.id].join('_'),
    region
  )
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

const getMapXAxis = ({ metric, demographic, region }) => {
  const [min, max] = getMetricRangeFromVarName(
    [demographic.id, metric.id].join('_'),
    region
  )
  const varName = `${demographic.id}_${metric.id}`
  const formatter = getFormatterForVarName(varName)
  return {
    min,
    max,
    inverse: region === 'schools',
    axisLabel: {
      show:
        ['avg', 'grd', 'coh', 'min'].indexOf(metric.id) === -1,
      inside: false,
      formatter: formatter
    },
    axisLine: { show: false },
    interval: getIncrementForVarName(varName, region),
    nameGap: 0,
    nameTextStyle: {},
    splitLine: { show: false }
  }
}

const xAxis = (variant, { varName, region }) => {
  const metric = getMetricFromVarName(varName)
  const demographic = getDemographicFromVarName(varName)
  if (!metric || !demographic) {
    return {}
  }
  switch (variant) {
    case 'map':
      return getMapXAxis({ metric, demographic, region })
    default:
      return getXAxis({ metric, demographic, region })
  }
}

/** Y AXIS CONFIGURATION */

const getYAxis = ({ metric, demographic, region, ...rest }) => {
  const [min, max] = getMetricRangeFromVarName(
    [demographic.id, metric.id].join('_'),
    region
  )
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

const getMapYAxis = ({
  metric,
  demographic,
  region,
  ...rest
}) => {
  const [min, max] = getMetricRangeFromVarName(
    [demographic.id, metric.id].join('_'),
    region
  )
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

const yAxis = (variant, { varName, region }) => {
  const metric = getMetricFromVarName(varName)
  const demographic = getDemographicFromVarName(varName)
  if (!metric || !demographic) {
    return {}
  }
  switch (variant) {
    case 'map':
      return getMapYAxis({ metric, demographic, region })
    default:
      return getYAxis({ metric, demographic, region })
  }
}

/**
 * Gets the state IDs that belong to a certain state
 * @param {array} ids
 * @param {string} fips
 */
const getStateIds = (ids, fips) => {
  if (ids && fips) {
    return ids.filter(d => d.substring(0, 2) === fips)
  }
  return []
}

/**
 * Gets the IDs for a provided state from the data
 * @param {string} stateId
 * @param {object} data
 */
const getStateHighlights = (stateId, data) => {
  return data && data['name'] && stateId
    ? getStateIds(Object.keys(data['name']), stateId)
    : []
}

export const getScatterplotOptions = (
  variant,
  data = {},
  { xVar, yVar, zVar },
  highlightedState,
  region
) => {
  if (!data[xVar] || !data[yVar] || !data[zVar]) {
    return {}
  }
  const sizerDem = getDemographicForVarNames(xVar, yVar)
  const sizer = getSizerFunctionForRegion(region, sizerDem)
  const options = {
    grid: grid(variant),
    visualMap: visualMap(variant, {
      xVar,
      yVar,
      highlightedState,
      region
    }),
    xAxis: xAxis(variant, { varName: xVar, region }),
    yAxis: yAxis(variant, { varName: yVar, region }),
    series: [
      series('base', variant, { highlightedState, sizer }),
      series('highlighted', variant, {
        highlightedState,
        sizer
      }),
      ...overlays(variant, { xVar, yVar, region })
    ]
  }
  // limit to 3000
  const hl = getStateHighlights(highlightedState, data).slice(
    0,
    3000
  )

  return getScatterplotBaseOptions({
    data,
    xVar,
    yVar,
    zVar,
    selected: [],
    highlighted: hl,
    options
  })
}
