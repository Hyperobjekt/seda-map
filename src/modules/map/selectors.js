import { fromJS } from 'immutable'
import MAP_STYLE from './style'
import {
  getRegionFromFeatureId,
  getChoroplethColors,
  getDemographicIdFromVarName,
  getMetricIdFromVarName,
  getMetricRange,
  isGapVarName
} from '../../shared/selectors'
import { DEFAULT_VIEWPORT } from './constants'

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
    source: 'composite',
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
  colors
}) => {
  return fromJS({
    id: layerId || 'schools-circle',
    source: 'composite',
    'source-layer': 'schools',
    type: 'circle',
    minzoom: getCircleMinZoom(region),
    // interactive: region === 'schools',
    interactive: true,
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
  region
}) =>
  fromJS({
    id: layerId || region + '-circle-casing',
    source: 'composite',
    'source-layer': 'schools',
    type: 'circle',
    minzoom: getCircleMinZoom(region),
    interactive: false,
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
    source: 'composite',
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
    source: 'composite',
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
  const featureRegion = getRegionFromFeatureId(id)
  return (
    featureRegion === 'districts' || featureRegion === 'counties'
  )
}

const isCircleId = id => {
  if (!id) {
    return false
  }
  const featureRegion = getRegionFromFeatureId(id)
  return featureRegion === 'schools'
}

export const getChoroplethLayer = ({
  layerId,
  region,
  metric,
  demographic,
  colors
}) =>
  fromJS({
    id: layerId || region + '-choropleth',
    source: 'composite',
    'source-layer': region === 'schools' ? 'districts' : region,
    type: 'fill',
    interactive: region !== 'schools',
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
 * @param {*} context { metric, demographic, region}
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

export const defaultMapStyle = fromJS(MAP_STYLE)

/**
 * Gets the viewport to use for the map based on the viewport
 * state and route parameters.
 * @param {*} vp
 * @param {*} routeParams
 * @returns {object} valid viewport object
 */
export const getMapViewport = (vp, routeParams) => {
  if (vp && vp.zoom && vp.latitude && vp.longitude) {
    // viewport is valid
    return vp
  } else if (
    routeParams &&
    routeParams.zoom &&
    routeParams.lat &&
    routeParams.lon
  ) {
    // no valid viewport in store, use the one in the route
    return {
      latitude: parseFloat(routeParams.lat),
      longitude: parseFloat(routeParams.lon),
      zoom: parseFloat(routeParams.zoom),
      ...vp
    }
  }
  // no viewport in store or route, use default
  return {
    ...DEFAULT_VIEWPORT,
    ...vp
  }
}

export const getLayers = context => {
  return [
    ...getChoroplethLayers(context),
    ...getCircleLayers(context)
  ]
}
