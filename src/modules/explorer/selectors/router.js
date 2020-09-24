import * as _debounce from 'lodash.debounce'
import * as polylabel from 'polylabel'
import { getRegionFromLocationId, getRegionFromFeature } from '.'
import { getStateFipsFromAbbr } from '../../../shared/utils/states'

const push = newRoute => {
  window.location.hash = newRoute
}

/**
 * Variables stored in the root, in order
 */
const DEFAULT_ROUTEVARS = [
  'view',
  'filter',
  'region',
  'metric',
  'secondary',
  'demographic',
  'zoom',
  'lat',
  'lon',
  'locations'
]

/**
 * Takes an individual rule string and produces a filter rule definition array
 * @param {*} rule
 */
export const ruleParamToArray = rule => {
  const [type, ...rest] = rule.split(',')
  switch (type) {
    case 'id':
      return ['startsWith', 'id', rest[0]]
    case 'avg':
    case 'grd':
    case 'coh':
    case 'ses':
    case 'frl':
      return ['range', type, rest[0].split(';')]
    case 'limit':
      return ['limit', rest[0]]
    default:
      throw new Error('could not process rule: ' + type)
  }
}

/**
 * Takes a filter rule array and produces a filter rule string for the route
 * @param {*} rule
 */
export const filterRuleToString = ruleArray => {
  const [type, ...rest] = ruleArray
  switch (type) {
    case 'startsWith':
      return ['id', rest[1]].join(',')
    case 'range':
      return [rest[0], rest[1].join(';')].join(',')
    case 'limit':
      return ['limit', rest[0]].join(',')
    case 'sort':
      return null
    default:
      throw new Error('could not process rule: ' + type)
  }
}

/**
 * Takes route params and returns a filter array based on the filter portion
 * @param {*} params
 */
export const paramsToFilterArray = params => {
  // handle legacy filter value (2 letter state)
  if (
    params.filter &&
    params.filter.length === 2 &&
    params.filter !== 'us'
  ) {
    const id = getStateFipsFromAbbr(params.filter)
    return [['startsWith', 'id', id]]
  }
  // filter rules are split by "+" and filter params are split by ","
  // e.g. id,02+avg,3-4+limit,10000
  const rules = params.filter.split('+').map(ruleParamToArray)
  console.log('converted params to filter rules', rules)
  return rules
}

/**
 * Takes array of filter rule array definitions and returns a string for the route
 * @param {*} filters
 */
export const filterArrayToString = filters => {
  return filters
    .map(filterRuleToString)
    .filter(f => !!f)
    .join('+')
}

/**
 * strip "#" and "/" from beginning and end
 * @param {*} route
 */
export const getStrippedRoute = route =>
  route.replace(/^#[/]+/g, '').replace(/\/$/g, '')

export const isEmptyRoute = route =>
  getStrippedRoute(route).length === 0

const isValidView = view =>
  ['map', 'chart', 'split'].indexOf(view) > -1

const isValidRegion = region =>
  ['states', 'counties', 'districts', 'schools'].indexOf(
    region
  ) > -1

const isValidDemographic = demographic => demographic.length < 4

const isValidMetric = metric =>
  ['avg', 'grd', 'coh'].indexOf(metric) > -1

const isValidSecondary = secondary =>
  ['ses', 'frl', 'seg', 'min'].indexOf(secondary) > -1

const isValidViewport = (zoom, lat, lon) =>
  !isNaN(zoom) && !isNaN(lat) && !isNaN(lon)

const isValidFilter = filter => Boolean(filter)

export const isValidExplorerRoute = (route, vars) => {
  const path = getStrippedRoute(route)
  if (path.length === 0) return true
  const params = getParamsFromPathname(path, vars)
  return (
    isValidView(params.view) &&
    isValidFilter(params.filter) &&
    isValidRegion(params.region) &&
    isValidMetric(params.metric) &&
    isValidSecondary(params.secondary) &&
    isValidDemographic(params.demographic) &&
    isValidViewport(params.zoom, params.lat, params.lon)
  )
}

/**
 * Gets a route string to represent the feature
 * @param {object} feature
 */
export const getLocationFromFeature = feature => {
  let point
  if (feature.geometry.type === 'MultiPolygon') {
    point = polylabel(feature.geometry.coordinates[0])
  } else if (feature.geometry.type === 'Polygon') {
    point = polylabel(feature.geometry.coordinates)
  } else if (feature.geometry.type === 'Point') {
    point = feature.geometry.coordinates
  } else {
    throw new Error('unsupported feature geometry type')
  }
  return (
    feature.properties.id +
    ',' +
    Math.round(point[1] * 100) / 100 +
    ',' +
    Math.round(point[0] * 100) / 100
  )
}

/**
 * Gets an array of objects representing the locations in the pathname
 * @param {string} locations contains comma separated id,lat,lon,
 *  with multuple locations concatenated with a '+'.
 *  e.g. "12019,28.89,-81.17+12015,27.83,-82.61"
 * @returns {[{id, lat, lon }]}
 */
export const parseLocationsString = locations => {
  if (!locations) {
    return []
  }
  const locationParts = ['id', 'lat', 'lon']
  return locations.split('+').map(l =>
    l.split(',').reduce(
      (acc, curr, i) => ({
        ...acc,
        [locationParts[i]]: curr
      }),
      {}
    )
  )
}

/**
 * Convert array of location objects to string
 * @param {*} locations
 */
export const locationsToString = locations =>
  locations.reduce(
    (acc, curr, i) =>
      acc +
      curr.id +
      ',' +
      curr.lat +
      ',' +
      curr.lon +
      (i === locations.length - 1 ? '' : '+'),
    ''
  )

/**
 * Gets a count of the number of locations by region type
 * @param {string} locations
 */
const getLocationCountByRegion = locations => {
  if (!locations) {
    return { states: 0, counties: 0, districts: 0, schools: 0 }
  }
  const featureIds = locations
    .split('+')
    .map(l => l.split(',')[0])
  return featureIds.reduce(
    (acc, curr) => {
      acc[getRegionFromLocationId(curr)]++
      return acc
    },
    { states: 0, counties: 0, districts: 0, schools: 0 }
  )
}

/**
 * Removes the first location of the provided region type from the
 * locations string.
 * @param {string} locations url formatted locations ({id},{lat},{lon}+{id2},{lat2},{lon2}...)
 * @param {*} region region type to remove from the url
 * @returns a location string with the first location of region type removed
 */
const removeFirstLocationForRegion = (locations, region) => {
  if (!region || !locations) {
    return locations
  }
  let isRemoved = false
  return locations
    .split('+')
    .map(l => {
      const r = getRegionFromLocationId(l.split(',')[0])
      if (isRemoved || r !== region) return l
      isRemoved = true
      return null
    })
    .filter(l => Boolean(l))
    .join('+')
}

/**
 * Adds a feature to the route pathname
 * @param {string} pathname
 * @param {object} feature
 * @returns {string}
 */
export const addFeatureToPathname = (pathname, feature) => {
  const currentRoute = getParamsFromPathname(pathname)
  const counts = getLocationCountByRegion(currentRoute.locations)
  const region = getRegionFromFeature(feature)
  const baseLocations =
    counts[region] < 6
      ? currentRoute.locations
      : removeFirstLocationForRegion(
          currentRoute.locations,
          region
        )
  const locations = baseLocations
    ? baseLocations + '+' + getLocationFromFeature(feature)
    : getLocationFromFeature(feature)
  return getPathnameFromParams(currentRoute, { locations })
}

/**
 * Removes a location from the pathname
 * @param {string} pathname
 * @param {string} locationId
 */
export const removeLocationFromPathname = (
  pathname,
  locationId
) => {
  const params = getParamsFromPathname(pathname)
  const locations = parseLocationsString(params.locations)
  const newLocations = locations.filter(l => l.id !== locationId)
  return getPathnameFromParams(params, {
    locations: locationsToString(newLocations)
  })
}

/**
 * Get a route parameters object based on the string
 * @param {string} path
 * @returns {object} e.g. { region: 'counties', metric: 'avg', ... }
 */
export const getParamsFromPathname = (
  path,
  routeVars = DEFAULT_ROUTEVARS
) => {
  // strip starting "#" and "/" chars
  const route = path.replace(/^#\/+/g, '')
  return route.split('/').reduce(
    (acc, curr, i) => ({
      ...acc,
      [routeVars[i]]:
        ['zoom', 'lat', 'lon'].indexOf(routeVars[i]) > -1
          ? parseFloat(curr)
          : curr
    }),
    {}
  )
}

/**
 * Get the route string based on some passed parameters
 * @param {object} params route parameters object
 * @param {object} updates (optional) any updates to make to the path
 * @returns {string} e.g. /counties/avg/all/5/37/-97
 */
export const getPathnameFromParams = (
  params,
  updates = {},
  routeVars = DEFAULT_ROUTEVARS
) => {
  const matches = { ...params, ...updates }
  return (
    '/' +
    routeVars
      .filter(p => !!matches[p])
      .map(p => matches[p])
      .join('/')
  )
}

/**
 * Pulls the viewport parameters from the route parameters object
 * @param {object} params route parameters object
 * @returns {object} e.g. { latitude: 37, longitude: -97, zoom: 5 }
 */
export const getViewportFromRoute = ({ params }) =>
  ['latitude', 'longitude', 'zoom'].reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: parseFloat(
        params[curr !== 'zoom' ? curr.substr(0, 3) : curr]
      )
    }),
    {}
  )

/**
 * Gets the viewport from the window location pathname
 * @param {string} path
 * @returns {object} e.g. { latitude: 37, longitude: -97, zoom: 5 }
 */
export const getViewportFromPathname = path => {
  const params = getParamsFromPathname(path)
  return {
    latitude: params.lat,
    longitude: params.lon,
    zoom: params.zoom
  }
}

/**
 * Checks if updates contain new data that are not
 * already in props.
 */
const areNewUpdates = (params, updates) => {
  return Object.keys(updates).reduce((acc, curr) => {
    return acc ? acc : params[curr] !== updates[curr].toString()
  }, false)
}

/**
 * Pushes an updated route to history
 * @param {object} props props from a component connected to the router
 * @param {object} updates an object of route params to update
 */
export const updateRoute = (updates, routeVars) => {
  if (updates && updates['highlightedState']) {
    updates['highlightedState'] = updates[
      'highlightedState'
    ].toLowerCase()
  }
  const path = window.location.hash.substr(1)
  const params = getParamsFromPathname(path)
  areNewUpdates(params, updates) &&
    push(getPathnameFromParams(params, updates, routeVars))
}

/**
 * Pushes an updated viewport to history. The function is debounced
 * because it is connected to the map `move` event which fires rapidly.
 * @param {object} props props from a component connected to the router
 * @param {object} vp an object with the updated viewport params
 */
export const updateViewportRoute = _debounce(vp => {
  if (vp.latitude && vp.longitude && vp.zoom) {
    const paramMap = ['latitude', 'longitude', 'zoom']
    const routeUpdates = ['lat', 'lon', 'zoom'].reduce(
      (acc, curr, i) => ({
        ...acc,
        [curr]: Math.round(vp[paramMap[i]] * 100) / 100
      }),
      {}
    )
    updateRoute(routeUpdates)
  }
}, 1000)

export const updateRegionInRoute = (pathname, region) => {
  const currentRoute = getParamsFromPathname(pathname)
  push(getPathnameFromParams(currentRoute, { region }))
}

const isFeatureInPathname = (feature, pathname) => {
  const id = feature.properties.id
  return pathname.indexOf(id + ',') > -1
}

/**
 * Pushes a location to the route based on a feature
 * @param {string} pathname
 * @param {object} feature
 */
export const addFeatureToRoute = (pathname, feature) => {
  if (isFeatureInPathname(feature, pathname)) {
    return
  }
  const newRoute = addFeatureToPathname(pathname, feature)
  push(newRoute)
}

/**
 * Pushes a location to the route based on a feature
 * @param {string} pathname
 * @param {object} feature
 */
export const removeFeatureFromRoute = (pathname, feature) => {
  const newRoute = removeLocationFromPathname(
    pathname,
    feature.properties.id
  )
  push(newRoute)
}
