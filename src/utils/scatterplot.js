import * as merge from 'lodash.merge';
import * as scale from 'd3-scale';

const containerOptions = {
  top: '24',
  right: '24',
  bottom: '24',
  left: '24',
};

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

const seriesOptions = {
  type: 'scatter',
  itemStyle: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)'
  },
  z:2
}

const visualMapOptions = {
  dimension: 1,
  calculable: false,
  show: false,
};

/**
 * Returns a scale function that can be used to map data values
 * to dot sizes
 */
export const getDataScale = (
  domain, { 
  range = [0, 1], 
  exponent = 1 
  }
) => {
  if (!domain) { return () => 0 }
  return scale.scalePow()
    .exponent(exponent)
    .domain(domain)
    .range(range)
    .clamp(true);
}

export const getDataSeries = (overrides = {}) => ({
  ...seriesOptions,
  ...overrides
})

export const getAxisOptions = (axisName, overrides = {}) => {
    const base = axisName === 'x' ? xAxisOptions : yAxisOptions;
    return merge(
      {},
      base,
      overrides
    );
  }

export const getContainerOptions = (overrides = {}) => {
  return merge(
    {},
    containerOptions,
    overrides
  );
}

export const getVisualMapOptions = (overrides = {}) => {
  return merge(
    {},
    visualMapOptions,
    overrides
  );
}

