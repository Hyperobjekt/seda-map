import { fromJS } from 'immutable'
import {
  getRegionFromLocationId,
  getChoroplethColors,
  isGapVarName,
  SHOW_PUERTO_RICO,
  SHOW_NATIVE_AMERICAN
} from '../app/selectors'
import { getFilterIndex } from '../../filters/useFilterStore'

const noDataFill = '#ccc'

/**
 * Returns the appropriate map zoom level for a given geography
 * @param {*} region ['states', 'counties', 'cities', 'districts', 'schools']
 */
export const getZoomLevelForRegion = region => {
  switch (region) {
    case 'states':
      return 6
    case 'counties':
      return 8
    case 'cities':
      return 12
    case 'districts':
      return 12
    case 'schools':
      return 14
    default:
      return 3.5
  }
}

/**
 * Gets the color stops for the provided metric ID
 * @param {string} id
 * @returns {array}
 */
export const getStopsForVarName = ({
  varName,
  colors = getChoroplethColors(),
  colorExtent
}) => {
  const isGap = isGapVarName(varName)
  colors = isGap ? [...colors].reverse() : colors
  const [min, max] = colorExtent
  const range = Math.abs(max - min)
  const stepSize = range / (colors.length - 1)
  return colors.map((c, i) => [min + i * stepSize, c])
}

const getFillStyle = ({ varName, colors, colorExtent }) => {
  const stops = getStopsForVarName({
    varName,
    colors,
    colorExtent
  }).reduce((acc, curr) => [...acc, ...curr], [])
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
  varName,
  ids,
  colors,
  colorExtent
}) => {
  const filters = ['all']
  if (!SHOW_NATIVE_AMERICAN) {
    const NATIVE_AMERICAN_FILTER = ["!=", ['get', 'bie'], 1]
    filters.push(NATIVE_AMERICAN_FILTER)
  }
  if (!SHOW_PUERTO_RICO) {
    const PUERTO_RICO_FILTER = ["!=", ['index-of', "72", ['get', 'id']], 0]
    filters.push(PUERTO_RICO_FILTER)
  }
  if (ids && ids.length > 0) {
    const MATCH_IDS_FILTER = ['in', ['get', 'id'], ['literal', ids]]
    filters.push(MATCH_IDS_FILTER)
  }
  return fromJS({
    id: layerId || 'schools-circle',
    source: 'seda',
    'source-layer': 'schools',
    type: 'circle',
    minzoom: getCircleMinZoom(region),
    // interactive: region === 'schools',
    interactive: true,
    ...(filters.length > 1
      ? { filter: filters }
      : {}),
    // layout: {
    //   visibility: demographic === 'all' ? 'visible' : 'none'
    // },
    paint: {
      'circle-color': getFillStyle({
        varName,
        region: 'schools',
        colors,
        colorExtent
      }),
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

/**
 * Returns a filter definition for a chorpleth layer based on the provided params
 */
const getChoroplethFilter = ({ region, filters, ids }) => {
  const filterArray = ['all']
  if (!SHOW_PUERTO_RICO) {
    const PUERTO_RICO_FILTER = ["!=", ['index-of', "72", ['get', 'id']], 0]
    filterArray.push(PUERTO_RICO_FILTER)
  }
  const prefixIndex = getFilterIndex(filters, [
    'startsWith',
    'id'
  ])
  // if schools and filtering within a region, only show district choropleths for that region
  if (region === 'schools' && prefixIndex > -1) {
    const prefix = filters[prefixIndex][2]
    const WITHIN_REGION_FILTER = ['in', prefix, ['get', 'id']]
    filterArray.push(WITHIN_REGION_FILTER)
  }
  // if not schools and filtering a set of id's, only show choropleths with those ids
  if (region !== 'schools' && ids && ids.length > 0) {
    const MATCH_IDS_FILTER = ['in', ['get', 'id'], ['literal', ids]]
    filterArray.push(MATCH_IDS_FILTER)
  }
  return filterArray.length > 1 ? { filter: filterArray } : {}
}

/**
 * Chhoropleth layer used for states, counties, district colors
 */
export const getChoroplethLayer = ({
  layerId,
  region,
  varName,
  filters,
  ids,
  colors,
  colorExtent
}) =>
  fromJS({
    id: layerId || region + '-choropleth',
    source: 'seda',
    'source-layer': region === 'schools' ? 'districts' : region,
    type: 'fill',
    interactive: true,
    ...getChoroplethFilter({ region, filters, ids }),
    paint: {
      'fill-color': getFillStyle({
        varName,
        region,
        colors,
        colorExtent
      }),
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
 * Gets all layers for rendering choropleths based on current context
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

/**
 * Gets all layers for rendering circles (schools) based on context
 * @param {*} context
 */
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

/**
 * Gets all map layers needed to render the current context
 * @param {*} context
 */
export const getLayers = context => {
  return [
    ...getChoroplethLayers(context),
    ...getCircleLayers(context)
  ]
}
