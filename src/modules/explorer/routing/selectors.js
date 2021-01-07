import * as _debounce from 'lodash.debounce'
import * as polylabel from 'polylabel'
import {
  getRegionFromLocationId,
  getRegionFromFeature
} from '../app/selectors'
import { allStateAbbrs, getStateFipsFromAbbr } from '../../../shared/utils/states'
import { formatNumber } from '../../../shared/utils'
import { DEFAULT_VIEWPORT } from '../../map'

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

// Legacy map route structure
const LEGACY_MAP_ROUTEVARS = [
  'view',
  'region',
  'metric',
  'demographic',
  'zoom',
  'lat',
  'lon',
  'locations'
]

// Legacy chart route structure
const LEGACY_CHART_ROUTEVARS = [
  'view',
  'highlightedState',
  'region',
  'xVar',
  'yVar',
  'zVar',
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
    case 'r':
    case 'u':
    case 's':
    case 't':
    case 'm':
    case 'e':
    case 'c':
    case 'ch':
    case 'mg':
      return ['eq', type, 1]
    case 'limit':
      return ['limit', rest[0]]
    default:
      console.warn(
        'could not process filter rule "' + type + '", ignoring'
      )
      return null
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
    case 'eq':
      return rest[0]
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
  const rules = params.filter
    .split('+')
    .map(ruleParamToArray)
    .filter(f => !!f)
  return rules
}

/**
 * Takes array of filter rule array definitions and returns a string for the route
 * @param {*} filters
 */
export const filterArrayToString = filters => {
  const filterString = filters
    .map(filterRuleToString)
    .filter(f => !!f)
    .join('+')
  return filterString ? filterString : 'none'
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
  ['ses', 'frl', 'seg', 'min'].indexOf(secondary.split("+")[0]) > -1

const isValidViewport = (zoom, lat, lon) =>
  !isNaN(zoom) && !isNaN(lat) && !isNaN(lon)

const isValidFilter = filter => true

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
 * Transform legacy path to a valid path following current route structure
 * @param {string} params
 * @param {string} routeVars
 * @returns {object} e.g. { region: 'counties', metric: 'avg', ... }
 */
export const transformLegacyPath = (path, routeVars) => {
  const route = path.replace(/^#\/+/g, '')
  const legacyParams = route.split('/').reduce(
    (acc, curr, i) => ({
      ...acc,
      [routeVars[i]]:
        ['zoom', 'lat', 'lon'].indexOf(routeVars[i]) > -1
          ? parseFloat(curr)
          : curr
    }),
    {}
  )

  // console.log("legacyParams", legacyParams)

  const validParams = []
  if(legacyParams.embed) validParams.push("embed")
  validParams.push(legacyParams.view)
  if(legacyParams.highlightedState) {
    validParams.push(legacyParams.highlightedState === "us" ? "none" : "id," + getStateFipsFromAbbr(legacyParams.highlightedState))
  }else {
    validParams.push("none")
  }
  validParams.push(legacyParams.region)
  if(legacyParams.metric) {
    validParams.push(legacyParams.metric)
  }else {
    validParams.push(legacyParams.yVar.split("_")[1])
  }
  if(legacyParams.xVar) {
    validParams.push(computeSecondary(legacyParams.xVar, legacyParams.yVar))
  } else {
    validParams.push("ses")
  }
  if(legacyParams.demographic) {
    validParams.push(legacyParams.demographic)
  }else {
    validParams.push(legacyParams.zVar.split("_")[0])
  }
  if(legacyParams.zoom) {
    validParams.push(legacyParams.zoom)
    validParams.push(legacyParams.lat)
    validParams.push(legacyParams.lon)
  }else {
    validParams.push(DEFAULT_VIEWPORT.zoom.toString())
    validParams.push(DEFAULT_VIEWPORT.latitude.toString())
    validParams.push(DEFAULT_VIEWPORT.longitude.toString())
  }
  if(legacyParams.locations) validParams.push(getLocationsRoute(legacyParams.locations))

  // console.log("#/" + validParams.join('/'))

  // return "#/map/none/counties/avg/ses/all/3.15/37.39/-97.57/"
  return "#/" + validParams.join('/')
}

const computeSecondary = (xVar, yVar) => {
  // check for post-underscore parts of xVar and yVar – if they don't match, take xVar's and add +secondary
  const xAxis = xVar.split("_")[1]
  const yAxis = yVar.split("_")[1]

  return xAxis === yAxis ? "ses" : xAxis + "+secondary"
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
  const routeSplit = route.split('/')

  // check for embed
  const isEmbedRoute = routeSplit[0] === 'embed'
  if(isEmbedRoute) {
    routeVars = ['embed', ...DEFAULT_ROUTEVARS]
  }

  // checking for legacy routes
  // if a legacy route is found, rerun with the transformed route
  if(routeSplit[isEmbedRoute ? 1 : 0] === 'map' && isValidRegion(routeSplit[isEmbedRoute ? 2 : 1])) {
    // legacy map link – transform to new hash structure
    routeVars = isEmbedRoute ? ['embed', ...LEGACY_MAP_ROUTEVARS] : LEGACY_MAP_ROUTEVARS
    return getParamsFromPathname(transformLegacyPath(path, routeVars))
  }
  if(routeSplit[isEmbedRoute ? 1 : 0] === 'chart' && allStateAbbrs.indexOf(routeSplit[isEmbedRoute ? 2 : 1]) > -1) {
    // legacy chart link, transform
    routeVars = isEmbedRoute ? ['embed', ...LEGACY_CHART_ROUTEVARS] : LEGACY_CHART_ROUTEVARS
    return getParamsFromPathname(transformLegacyPath(path, routeVars))
  }

  return routeSplit.reduce(
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

  // check for embed
  const isEmbedRoute = !!params.embed
  // console.log("params isEmbedRoute:", isEmbedRoute)
  routeVars = isEmbedRoute ? ['embed', ...DEFAULT_ROUTEVARS] : DEFAULT_ROUTEVARS

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

/**
 * Gets a route string for locations
 * @param {*} locations
 * @returns {string}
 */
export const getLocationsRoute = locations => {
  let locationsRoute = locations
    .filter(l => !!l)
    .map(l => [l.id, l.lat, l.lon].join(','))
    .join('+')
  return locationsRoute
}

/**
 * Gets a route string for viewport
 * @param {*} viewport
 * @returns {string}
 */
export const getViewportRoute = viewport => {
  return [
    formatNumber(viewport.zoom),
    formatNumber(viewport.latitude),
    formatNumber(viewport.longitude)
  ].join('/')
}
