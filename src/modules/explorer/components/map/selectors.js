import { fromJS } from 'immutable'
import {
  getRegionFromLocationId,
  getChoroplethColors,
  getDemographicIdFromVarName,
  getMetricIdFromVarName,
  getMetricRange,
  isGapVarName
} from '../../selectors'
import { getFilterIndex } from '../../../filters/useFilterStore'

const noDataFill = '#ccc'

/**
 * Gets the color stops for the provided metric ID
 * @param {string} id
 * @returns {array}
 */
export const getStopsForVarName = (
  varName,
  region,
  colors = getChoroplethColors()
) => {
  const demId = getDemographicIdFromVarName(varName)
  const metricId = getMetricIdFromVarName(varName)
  const isGap = isGapVarName(varName)
  colors = isGap ? [...colors].reverse() : colors
  const [min, max] = getMetricRange(
    metricId,
    demId,
    region,
    'map'
  )
  const range = Math.abs(max - min)
  const stepSize = range / (colors.length - 1)
  return colors.map((c, i) => [min + i * stepSize, c])
}

const getFillStyle = (varName, region, colors) => {
  const stops = getStopsForVarName(
    varName,
    region,
    colors
  ).reduce((acc, curr) => [...acc, ...curr], [])
  return [
    'case',
    ['==', ['get', varName], -999],
    noDataFill,
    ['has', varName],
    ['interpolate', ['linear'], ['get', varName], ...stops],
    noDataFill
  ]
}

const getCircleOpacity = region =>
  region === 'schools'
    ? ['interpolate', ['linear'], ['zoom'], 2, 0, 3, 1]
    : ['interpolate', ['exponential', 2], ['zoom'], 8, 0, 10, 1]

const getCircleRadius = (region, offset = 0) =>
  region === 'schools'
    ? [
        'interpolate',
        ['linear'],
        ['zoom'],
        2,
        2 + offset,
        4,
        3 + offset,
        14,
        12 + offset
      ]
    : [
        'interpolate',
        ['linear'],
        ['zoom'],
        7,
        0,
        8,
        1 + offset,
        14,
        12 + offset
      ]

const getCircleMinZoom = region => (region === 'schools' ? 2 : 8)

export const getCircleHighlightLayer = ({ layerId, region }) =>
  fromJS({
    id: layerId || region + '-circle-highlight',
    source: 'seda',
    'source-layer': 'schools',
    type: 'circle',
    minzoom: getCircleMinZoom(region),
    interactive: false,
    layout: {
      visibility: 'visible'
    },
    paint: {
      'circle-color': 'rgba(0,0,0,0)',
      'circle-opacity': 1,
      'circle-radius': getCircleRadius(region, -3),
      'circle-stroke-opacity': 1,
      'circle-stroke-color': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        '#f00',
        [
          'string',
          ['feature-state', 'selected'],
          'rgba(0,0,0,0)'
        ]
      ],
      'circle-stroke-width': [
        'interpolate',
        ['linear'],
        ['zoom'],
        4,
        2,
        6,
        2,
        14,
        4
      ]
    }
  })

export const getCircleLayer = ({
  layerId,
  region,
  metric,
  demographic,
  ids,
  colors
}) => {
  return fromJS({
    id: layerId || 'schools-circle',
    source: 'seda',
    'source-layer': 'schools',
    type: 'circle',
    minzoom: getCircleMinZoom(region),
    // interactive: region === 'schools',
    interactive: true,
    ...(ids && ids.length > 0
      ? { filter: ['in', ['get', 'id'], ['literal', ids]] }
      : {}),
    layout: {
      visibility: demographic === 'all' ? 'visible' : 'none'
    },
    paint: {
      'circle-color': getFillStyle(
        [demographic, metric].join('_'),
        'schools',
        colors
      ),
      'circle-opacity': getCircleOpacity(region),
      'circle-radius': getCircleRadius(region),
      'circle-stroke-opacity': getCircleOpacity(region),
      'circle-stroke-color': '#fff',
      'circle-stroke-width': [
        'interpolate',
        ['linear'],
        ['zoom'],
        4,
        0,
        6,
        0.5,
        14,
        2
      ]
    }
  })
}

export const getCircleCasingLayer = ({
  layerId,
  demographic,
  ids,
  region
}) =>
  fromJS({
    id: layerId || region + '-circle-casing',
    source: 'seda',
    'source-layer': 'schools',
    type: 'circle',
    minzoom: getCircleMinZoom(region),
    interactive: false,
    ...(ids && ids.length > 0
      ? {
          filter: ['in', ['get', 'id'], ['literal', ids]]
        }
      : {}),
    layout: {
      visibility: demographic === 'all' ? 'visible' : 'none'
    },
    paint: {
      'circle-stroke-opacity': getCircleOpacity(region),
      'circle-radius': getCircleRadius(region, 1),
      'circle-color': 'transparent',
      'circle-stroke-color': [
        'interpolate',
        ['linear'],
        ['zoom'],
        6,
        '#ccc',
        8,
        '#5d5d5d'
      ],
      'circle-stroke-width': [
        'interpolate',
        ['linear'],
        ['zoom'],
        8,
        0.5,
        10,
        1,
        14,
        2
      ]
    }
  })

export const getChoroplethOutline = ({ layerId, region }) =>
  fromJS({
    id: layerId || region + '-choropleth-outline',
    source: 'seda',
    'source-layer': region,
    type: 'line',
    interactive: false,
    paint: {
      'line-color': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        '#f00',
        [
          'string',
          ['feature-state', 'selected'],
          'rgba(0,0,0,0)'
        ]
      ],
      'line-width': [
        'case',
        [
          'any',
          ['boolean', ['feature-state', 'hover'], false],
          ['to-boolean', ['feature-state', 'selected']]
        ],
        2.5,
        0
      ]
    }
  })

/**
 * Gets the mapboxgl layer for the choropleth outline
 * @param {string} region
 */
export const getChoroplethOutlineCasing = ({
  layerId,
  region
}) =>
  fromJS({
    id: layerId || region + '-choropleth-outline-casing',
    source: 'seda',
    'source-layer': region,
    type: 'line',
    interactive: false,
    paint: {
      'line-color': '#fff',
      'line-opacity': [
        'case',
        [
          'any',
          ['boolean', ['feature-state', 'hover'], false],
          ['to-boolean', ['feature-state', 'selected']]
        ],
        1,
        0
      ],
      'line-width': [
        'case',
        [
          'any',
          ['boolean', ['feature-state', 'hover'], false],
          ['to-boolean', ['feature-state', 'selected']]
        ],
        1.5,
        0
      ],
      'line-gap-width': [
        'case',
        [
          'any',
          ['boolean', ['feature-state', 'hover'], false],
          ['to-boolean', ['feature-state', 'selected']]
        ],
        2.5,
        0
      ]
    }
  })

const isChoroplethId = id => {
  if (!id) {
    return false
  }
  const featureRegion = getRegionFromLocationId(id)
  return (
    featureRegion === 'districts' ||
    featureRegion === 'counties' ||
    featureRegion === 'states'
  )
}

const isCircleId = id => {
  if (!id) {
    return false
  }
  const featureRegion = getRegionFromLocationId(id)
  return featureRegion === 'schools'
}

const getLayerFilter = ({
  region,
  demographic,
  filter: [type, prop, value]
}) => {
  const demProp = demographic + '_' + prop
  switch (type) {
    case 'startsWith':
      return value
        ? [
            '==',
            value,
            ['slice', ['get', demProp], 0, value.length]
          ]
        : null
    case 'range':
      if (region === 'schools' && prop === 'ses') return null
      if (region !== 'schools' && prop === 'frl') return null
      return [
        'all',
        ['>=', ['get', demProp], value[0]],
        ['<=', ['get', demProp], value[1]]
      ]
    default:
      return null
  }
}

const getLayerFilters = ({ region, demographic, filters }) => {
  const layerFilters = filters
    .map(filter =>
      getLayerFilter({ region, demographic, filter })
    )
    .filter(f => !!f)
  return ['all', ...layerFilters]
}

const getChoroplethFilter = ({ region, filters, ids }) => {
  const prefixIndex = getFilterIndex(filters, [
    'startsWith',
    'id'
  ])
  if (region === 'schools' && prefixIndex > -1) {
    const prefix = filters[prefixIndex][2]
    return {
      filter: ['in', prefix, ['get', 'id']]
    }
  }
  if (region !== 'schools' && ids && ids.length > 0) {
    return { filter: ['in', ['get', 'id'], ['literal', ids]] }
  }
  return {}
}

export const getChoroplethLayer = ({
  layerId,
  region,
  metric,
  demographic,
  filters,
  ids,
  colors
}) =>
  fromJS({
    id: layerId || region + '-choropleth',
    source: 'seda',
    'source-layer': region === 'schools' ? 'districts' : region,
    type: 'fill',
    interactive: true,
    // filter: getLayerFilters({ region, demographic, filters }),
    ...getChoroplethFilter({ region, filters, ids }),
    paint: {
      'fill-color': getFillStyle(
        [demographic, metric].join('_'),
        region,
        colors
      ),
      'fill-opacity':
        region === 'schools'
          ? [
              'interpolate',
              ['linear'],
              ['zoom'],
              3,
              0,
              8,
              0.5,
              10,
              0.666
            ]
          : 1
    }
  })

/**
 * Gets choropleth layer based on current context
 * @param {*} context { metric, demographic, region, filters}
 */
export const getChoroplethLayers = context => {
  return [
    {
      z: 1,
      style: getChoroplethLayer(context),
      hasFeatureId: isChoroplethId
    },
    { z: 50, style: getChoroplethOutline(context) },
    { z: 50, style: getChoroplethOutlineCasing(context) }
  ]
}

export const getCircleLayers = context => {
  return [
    { z: 50, style: getCircleHighlightLayer(context) },
    {
      z: 50,
      style: getCircleLayer(context),
      idMap: true,
      hasFeatureId: isCircleId
    },
    { z: 50, style: getCircleCasingLayer(context) }
  ]
}

export const getLayers = context => {
  return [
    ...getChoroplethLayers(context),
    ...getCircleLayers(context)
  ]
}

export const SEDA_SOURCES = fromJS({
  seda: {
    url:
      'mapbox://hyperobjekt.states-v4-' +
      process.env.REACT_APP_BUILD_ID +
      ',hyperobjekt.counties-v4-' +
      process.env.REACT_APP_BUILD_ID +
      ',hyperobjekt.districts-v4-' +
      process.env.REACT_APP_BUILD_ID +
      ',hyperobjekt.schools-v4-' +
      process.env.REACT_APP_BUILD_ID,
    type: 'vector'
  }
})
