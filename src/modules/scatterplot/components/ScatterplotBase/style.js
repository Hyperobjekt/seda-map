import * as merge from 'deepmerge'

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
export const extendScatterplotOptions = (overrides = {}) => ({
  grid: getGridOptions(overrides.grid),
  xAxis: getAxisOptions('x', overrides.xAxis),
  yAxis: getAxisOptions('y', overrides.yAxis),
  visualMap: getVisualMapOptions(overrides.visualMap),
  ...overrides
})
