import { fade } from '@material-ui/core/styles/colorManipulator';
import { isGapDemographic, isGapVar, getDemographicFromVarName, getLabelFromVarName, getMetricIdFromVarName, getMetricFromVarName, getSelectedColors, getChoroplethColors, getDemographicById, getDemographicIdFromVarName } from '../modules/config';
import { getStateName } from '../constants/statesFips';

/** GRID CONFIGURATION  */

export const grid = (variant) => {
  switch(variant) {
    case 'map':
      return {
        top: 0,
        right: 80,
        bottom: 48,
        left: 24,
      }
    default:
      return { 
        top: 24, 
        right: 48,
        bottom: 48, 
        left: 0, 
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
const getBaseSeries = ({ highlightedState }) => 
  getSeries('base', 'scatter', {
    animation: false,
    silent: highlightedState ? true : false,
    itemStyle: {
      color: highlightedState ? 
        'rgba(0,0,0,0.1)' : '#76ced2cc',
      borderColor: highlightedState ? 
        'rgba(0,0,0,0.1)' : 'rgba(6, 29, 86, 0.4)',
    },
  })

/**
 * Get the style overrides for the highlight series
 */
const getHighlightedSeries = ({ highlightedState }) =>
  getSeries('highlighted', 'scatter', {
    show: highlightedState,
    itemStyle: {
      borderColor: 'rgba(6, 29, 86, 0.4)'
    }
  })

/**
 * Get the style overrides for the selected series
 */
const getSelectedSeries = ({ colors = getSelectedColors() }) =>
  getSeries('selected', 'scatter', {
    label: {
      show:true,
      formatter: ({dataIndex}) => {
        return dataIndex+1
      },
      color: '#fff',
      textBorderColor: 'rgba(6, 29, 86, 1)',
      textBorderWidth: 3,
      fontWeight: 'bolder',
      fontSize: 16,
      position: 'top',
      
    },
    'emphasis': {
      label: { 
        textBorderColor: '#f00',
        show:true,
        color: '#fff',
        textBorderWidth: 3,
        fontWeight: 'bolder',
        fontSize: 16,
        position: 'top',
        distance: 5,
      }
    },
    itemStyle: {
      color: ({dataIndex}) => {
        return colors[dataIndex % colors.length]
      },
      borderWidth: 0,
      borderColor: 'rgba(0,0,0,0)',
      shadowColor: '#fff',
      shadowBlur: 1,
    }
  })


export const series = (seriesId, variant, options = {}) => {
  switch(seriesId) {
    case 'base':
      return getBaseSeries(options)
    case 'highlighted':
      return getHighlightedSeries(options)
    case 'selected':
      return getSelectedSeries(options)
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
const getMarkPoints = (points) => {
  return {
    animation: false,
    silent: true,
    data: points
      .map(p => p.axis ? getAxisPoint(p) : null)
      .filter(p => p)
  }
}

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
      show:false
    },
    markPoint: getMarkPoints(points.map(p => ({
      axis:'y', x: '97%', y: p.value[1], label: p.name
    }))),
    markLine: getMarkLines(lines)
  }
}

/**
 * Gets a point that falls on the x or y axis
 * @param {object} point 
 */
const getAxisPoint = ({axis, x, y, label, options }) => {
  const position = axis === 'y' ?
    { x: x, yAxis: y } :
    { y: y, xAxis: x };
    return {
      ...position,
      symbol: 'circle',
      symbolSize: 1,
      label: {
        formatter: '{val|' + label + '}',
        align: 'right',
        rich: {
          val: {
            fontSize: 12,
            fontWeight: 'normal',
            color: '#000',
            borderWidth: 0,
            borderColor: 'rgba(0,0,0,0)',
            backgroundColor: 'rgba(255,255,255,0.8)',
            textBorderColor: 'transparent',
            textBorderWidth: 0,
            lineHeight: 18
          }
        },
      },
      ...options
    }
}

/**
 * Gets `series.markLine` echart options based on an
 * array of lines.
 * @param {array<{axis, position, style}>} lines 
 */
const getMarkLines = (lines) => {
  return {
    animation: false,
    silent: true,
    data: lines
      .map(l => l.axis ? getAxisLine(l) : null)
      .filter(l => l)
  }
}

/**
 * Gets line data that spans the graph on the x or y axis
 * @param {object} line 
 */
const getAxisLine = ({axis, position, style}) => {
  const startPosition = axis === 'y' ?
    { x: 0, yAxis: position } :
    { y: 24, xAxis: position };
  const endPosition = axis === 'y' ?
    { x: '100%', yAxis: position } :
    { y: '100%', xAxis: position };
  return [
    {
      ...startPosition,
      symbol: 'none',
      lineStyle: {
        color: 'rgba(0,0,0,0.2)',
        ...style
      }
    },
    {
      ...endPosition,
      symbol: 'none' 
    }
  ]
}


const getMapAverageOverlay = () => getOverlay(
  new Array(7).fill().map((v, i) => {
    const position = -3 + i;
    const grades = Math.abs(position) === 1 ? 'grade' : 'grades'
    const label = position === 0 ? 'average\nperformance' :
      position > 0 ? 
        `${Math.abs(position)} ${grades}\nahead` : 
        `${Math.abs(position)} ${grades}\nbehind`
    return {
      value: [0, position], 
      name: label,
      visualMap: false
    }
  }),
  new Array(7).fill().map((v, i) => ({
    axis: 'y',
    position: -3 + i
  }))
)

const getMapAverageGapOverlay = () => getOverlay(
  new Array(8).fill().map((v, i) => {
    const position = 0 - i;
    const grades = Math.abs(position) === 1 ? 'grade' : 'grades'
    const label = position === 0 ? 'no\ndifference' :
      `${Math.abs(position)} ${grades}\ndifference`
    return {
      value: [0, position], 
      name: label,
      visualMap: false
    }
  }),
  new Array(8).fill().map((v, i) => ({
    axis: 'y',
    position: 0 - i
  }))
)

const getMapGrowthOverlay = () => getOverlay(
  new Array(5).fill().map((v, i) => {
    const position = 0.6 + (i * (1)/5);
    const label = position === 1 ? 'average\ngrowth' :
      position > 1 ? 
        `${Math.abs(position)} grade levels\nper year` : 
        `${Math.abs(position)} grade levels\nper year`
    return {
      value: [0, position], 
      name: label,
      visualMap: false
    }
  }),
  new Array(5).fill().map((v, i) => ({
    axis: 'y',
    position: 0.6 + (i * 1/5)
  }))
)

const getMapGrowthGapOverlay = () => getOverlay(
  new Array(5).fill().map((v, i) => {
    const position = Math.round((-0.4 + (i * (1)/5)) * 10) / 10;
    const label = position === 0 ? 'no change\nin growth gap' :
      `${Math.abs(position)} ${position > 0 ? 'increase' : 'decrease'}\nin growth gap`
    return {
      value: [0, position], 
      name: label,
      visualMap: false
    }
  }),
  new Array(5).fill().map((v, i) => ({
    axis: 'y',
    position: -0.4 + (i * 1/5)
  }))
)

const getMapTrendOverlay = () => getOverlay(
  new Array(5).fill().map((v, i) => {
    const position = Math.round((-0.2 + (i * 0.1))*10)/10;
    const label = position === 0 ? 'no change\nin test scores' :
      position > 0 ? 
        `${Math.abs(position)} grade level\nincrease` : 
        `${Math.abs(position)} grade level\ndecrease`
    return {
      value: [0, position], 
      name: label,
      visualMap: false
    }
  }),
  new Array(5).fill().map((v, i) => ({
    axis: 'y',
    position: -0.2 + (i * 0.1)
  }))
)

const getMapTrendGapOverlay = () => getOverlay(
  new Array(5).fill().map((v, i) => {
    const position = Math.round((-0.2 + (i * 0.1))*10)/10;
    const label = position === 0 ? 'no change\nin trend gap' :
      `${Math.abs(position)} ${position > 0 ? 'increase' : 'decrease'}\nin trend gap`
    return {
      value: [0, position], 
      name: label,
      visualMap: false
    }
  }),
  new Array(5).fill().map((v, i) => ({
    axis: 'y',
    position: -0.2 + (i * 0.1)
  }))
)

const getOpportunityAverageOverlay = () => ({
  type: 'line',
  animation: false,
  silent: true,
  visualMap: false,
  data: [[-4, -4], [4, 4]],
  symbolSize: 0.1,
  label: {
    show:false
  },
  itemStyle: {
    color: '#999'
  },
  markLine: {
    animation: false,
    silent: true,
    label: {
      position: 'middle',
      formatter: function(value) {
        return value.name
      } 
    },
    lineStyle: {
      type: 'dashed',
      color: '#999'
    },
    data: [
      [
        { 
          name: 'equal opportunity', 
          coord: [-4, -4], 
          symbol: 'none',
        },
        { coord: [ 4,  4], symbol: 'none' },
      ]
    ]
  }
})

const overlays = (variant, { xVar, yVar }) => {
  const yMetricId = getMetricIdFromVarName(yVar);
  switch(yMetricId + '_' + variant) {
    case 'avg_map':
      if (isGapVar(yVar))
        return [ getMapAverageGapOverlay() ]
      else
        return [ getMapAverageOverlay() ]
    case 'grd_map':
      if (isGapVar(yVar))
        return [ getMapGrowthGapOverlay() ]
      else
        return [ getMapGrowthOverlay() ]
    case 'coh_map':
      if (isGapVar(yVar))
        return [ getMapTrendGapOverlay() ]
      else
        return [ getMapTrendOverlay() ]
    case 'avg_opp':
      return [ getOpportunityAverageOverlay() ]
    default:
      return []
  }
}

/** VISUAL MAP CONFIGURATION */

const getMapVisualMap = ({
  varName,
  colors = getChoroplethColors(), 
  highlightedState
}) => {
  const metric = getMetricFromVarName(varName);
  return {
    type: 'continuous',
    min: isGapVar(varName) ? metric.gapMin : metric.min,
    max: isGapVar(varName) ? metric.gapMax : metric.max,
    inRange: {
      color: colors.map(c => fade(c, 0.9))
    },
    show:false,
    seriesIndex: highlightedState ? 2 : 0,
    calculable: true,
    right:0,
    bottom:'auto',
    top:'auto',
    left: 'auto',
    orient: 'vertical',
    itemHeight: 400,
    itemWidth: 24,
    precision: 1,
  }
}

const visualMap = (
  variant,
  options,
) => {
  switch (variant) {
    case 'map':
      return [ getMapVisualMap(options) ]
    default:
      return []
  }
}

/** X AXIS CONFIGURATION */

const getXAxis = ({ metric, demographic, ...rest }) => (
  {
    axisLabel: { show: true },
    axisLine: { show: false },
    splitLine: { show: true },
    splitNumber: 7,
    nameGap: 32,
    nameLocation: 'middle',
    min: metric.min,
    max: metric.max,
    name: metric.label + (
      demographic && demographic.label ? 
        ' (' + demographic.label + ' students)' : 
        ''
    ),
    ...rest
  }
)

const getMapXAxis = ({ metric, demographic }) => ({
  splitLine: { show: false },
  axisLabel: {
    formatter: function (val) {
      if (val === 0) {
        return isGapDemographic(demographic.id) ?
          'no gap in\nsocioeconomic status' : 
          'average\nsocioeconomic status'
      }
      return null;
    },
    fontSize: 14,
    inside: false,
    margin: 10,
  }
})

const getGrowthXAxis = (options) => getXAxis({
  ...options,
  splitNumber: 5,
  interval: 0.2,
})

const getSocioeconomicXAxis = ({ metric, demographic }) => getXAxis({
  metric,
  demographic,
  name: metric.label + (
    demographic && demographic.label ? 
      ' (' + demographic.label + ')' : 
      ''
  ),
})

const xAxis = (variant, { varName }) => {
  const metric = getMetricFromVarName(varName);
  const demographic = getDemographicFromVarName(varName);
  if (!metric || !demographic) { return {} }
  switch (variant) {
    case 'map':
      return getMapXAxis({ metric, demographic })
    default:
      if (
        metric.id === 'grd' && 
        ['p','np','b'].indexOf(demographic.id) > -1
      )
        return getGrowthXAxis({metric, demographic})
      else if (
        metric.id === 'ses' && 
        ['wb','wh','wa','pn'].indexOf(demographic.id) > -1
      )
        return getSocioeconomicXAxis({ metric, demographic })
      else
        return getXAxis({metric, demographic})
  }
}

/** Y AXIS CONFIGURATION */

const getYAxis = ({metric, demographic, ...rest}) => ({
  position: 'right',
  min: isGapDemographic(demographic.id) ? metric.gapMin : metric.min,
  max: isGapDemographic(demographic.id) ? metric.gapMax : metric.max,
  axisLabel: { 
    show: true,
    showMinLabel: false,
    showMaxLabel: false,
  },
  axisLine: { show: false },
  splitLine: { show: true },
  splitNumber: 7,
  name: metric.label + (
    demographic && demographic.label ? 
      ' (' + demographic.label + ' students)' : 
      ''
  ),
  nameGap: 32,
  nameLocation: 'middle',
  ...rest
})

const getMapYAxis = ({metric, demographic, ...rest}) => {
  return {
    position: 'right',
    axisLabel: { 
      show: false,
      showMinLabel: false,
      showMaxLabel: false,
    },
    axisLine: { 
      show: true,
      lineStyle: {
        type: 'dashed',
        color: '#ccc'
      }
    },
    splitLine: { show: false },
    min: isGapDemographic(demographic.id) ? metric.gapMin : metric.min,
    max: isGapDemographic(demographic.id) ? metric.gapMax : metric.max,
    ...rest
  }
}

const yAxis = (variant, { varName }) => {
  const metric = getMetricFromVarName(varName);
  const demographic = getDemographicFromVarName(varName);
  if (!metric || !demographic) { return {} }
  switch (variant) {
    case 'map':
      return getMapYAxis({ metric, demographic })
    default:
      return getYAxis({ metric, demographic })
  }
}

/** TOOLTIP CONFIGURATION */

const getGapLabel = (gapId) => {
  const dem1 = 
    getDemographicById(gapId[0])
  const dem2 = 
    getDemographicById(gapId[1] === 'n' ? 'np' : gapId[1])
  return `${dem1.label} and ${dem2.label}`.toLowerCase()
}

const getAverageScoreDescription = (value, varName) => {
  const demographicId = getDemographicIdFromVarName(varName)
  const isGap = isGapDemographic(demographicId);
  const amount = Math.round(value*100)/100
  return isGap ?
    `Difference of ${amount} grade levels between
      ${getGapLabel(demographicId)} students`
    :
    `Students score ${Math.abs(amount)} grade levels 
      ${amount > 0 ? 'above' : 'below'} average`
}

const getGrowthDescription = (value, varName) => {
  const demographicId = getDemographicIdFromVarName(varName)
  const isGap = isGapDemographic(demographicId);
  const amount = Math.round(value*100)/100
  return isGap ?
    `Difference in growth ${amount > 0 ? 'increased' : 'decreased'} 
      ${Math.abs(amount)} grade levels between
      ${getGapLabel(demographicId)} students`
    :
    `Students grow ${amount} grade levels each year`;
}

const getTrendDescription = (value, varName) => {
  const demographicId = getDemographicIdFromVarName(varName)
  const isGap = isGapDemographic(demographicId);
  const amount = Math.round(value*100)/100
  return isGap ?
    `Difference in test scores ${amount > 0 ? 'increased' : 'decreased'}
      ${Math.abs(amount)} grade levels between
      ${getGapLabel(demographicId)} students`
    :
    `Test scores ${amount > 0 ? 'raising' : 'falling'} 
      ${Math.abs(amount)} grade levels over time`;
}

const getDescriptionForVarName = (varName, value) => {
  if (!value || value === -9999) { return ''; }
  const metric = getMetricFromVarName(varName);
  switch(metric.id) {
    case 'avg':
      return getAverageScoreDescription(value, varName)
    case 'grd':
      return getGrowthDescription(value, varName)
    case 'coh':
      return getTrendDescription(value, varName)
    default:
      return ''
  }
}

/**
 * Get the label for the provided varnames and values
 * @param {*} values 
 */
export const getTooltipText = (values) =>
  Object.keys(values).reduce((str, varName) => {
    return str + getDescriptionForVarName(varName, values[varName])
  }, '')

const getTooltip = ({ data, xVar, yVar, ...rest }) => {
  const xLabel = getLabelFromVarName(xVar);
  const yLabel = getLabelFromVarName(yVar);
  const placeNames = data && data.name ? data.name : {};
  return {
    show:true,
    trigger: 'item',
    formatter: ({value}) => {
      const name = placeNames && placeNames[value[3]] ? 
        placeNames[value[3]] : 'Unknown'
      const stateName = getStateName(value[3])
      const line1 = xLabel + ': ' + value[0];
      const line2 = yLabel + ': ' + value[1];
      return `
        <div class="tooltip__title">${name}, ${stateName}</div>
        <div class="tooltip__content">
          ${line1}<br />
          ${line2}
        </div>        
      `
    },
    ...rest
  }
}

const getMapTooltip = ({data, xVar, yVar}) => getTooltip({
  data,
  xVar,
  yVar, 
  extraCssText: 'max-width: 188px; white-space: normal',
  formatter: ({value}) => {
    const placeNames = data && data.name ? data.name : {};
    const name = placeNames && placeNames[value[3]] ? 
      placeNames[value[3]] : 'Unknown'
    const stateName = getStateName(value[3])
    return `
      <div class="tooltip__title">${name}, ${stateName}</div>
      <div class="tooltip__content">
        ${getTooltipText({ [xVar]: value[0], [yVar]: value[1] })}
      </div>
    `
  }
})

const tooltip = (variant, { data, xVar, yVar }) => {
  switch(variant) {
    case 'map':
      return getMapTooltip({ data, xVar, yVar })
    default:
      return getTooltip({ data, xVar, yVar })
  }
}


export const getScatterplotOptions = (
  variant,
  data = {},
  { xVar, yVar },
  highlightedState, 
) => ({
    grid: grid(variant),
    visualMap: visualMap(variant, { varName: yVar, highlightedState }),
    xAxis: xAxis(variant, { varName: xVar }),
    yAxis: yAxis(variant, { varName: yVar }),
    series: [
      series('base', variant, { highlightedState }),
      series('highlighted', variant, { highlightedState }),
      series('selected', variant),
      ...overlays(variant, { xVar, yVar })
    ],
    tooltip: tooltip(variant, { data, xVar, yVar })
  })
