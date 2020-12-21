import {
  REGIONS,
  REGION_DOMAINS,
  ID_LENGTH_TO_REGION
} from '../constants/regions'
import { getPrefixLang } from './lang'
import logger from '../../../logger'

/**
 * Gets the configuation for regions
 */
export const getRegions = () => REGIONS

/**
 * Gets the region object corresponding to the provided ID
 */
export const getRegionById = id =>
  getRegions().find(r => r.id === id)

/** Gets regions with singular name (e.g. "county" instead of "counties") */
export const getSingularRegions = () =>
  REGIONS.map(r => ({
    id: r.id,
    label: getPrefixLang(r.id, 'LABEL_SINGULAR')
  }))

/** Gets a region with singular name (e.g. "county" instead of "counties") */
export const getSingularRegion = rId =>
  rId ? getPrefixLang(rId, 'LABEL_SINGULAR') : ''

/**
 * Takes a location ID integer and pads it with 0's
 * so it is a valid identifier for the provided region
 * (eg. `intToRegionId(5001, 'counties)` yields `05001`)
 */
export const intToRegionId = (value, region) => {
  const s = '0000000000000' + value
  const length = Object.keys(ID_LENGTH_TO_REGION).find(
    k => ID_LENGTH_TO_REGION[k] === region
  )
  if (length) {
    return s.substr(s.length - parseInt(length))
  }
  throw new Error('no id length for region ' + region)
}

/**
 * Gets the region that corresponds to the provided ID
 * @param {string} id
 */
export const getRegionFromLocationId = id => {
  if (!id) {
    return null
  }
  if (!ID_LENGTH_TO_REGION[id.length]) {
    logger.debug('error getting region for id', id)
    throw new Error('No region corresponding to provided ID')
  }
  return ID_LENGTH_TO_REGION[id.length]
}

/**
 * Gets the region that corresponds to the provided ID
 * @param {string} id
 */
export const getRegionFromFeature = feature => {
  if (!feature || !feature.properties) {
    return null
  }
  return getRegionFromLocationId(feature.properties.id)
}

/**
 * Returns the provided location IDs array as an object
 * with a key for each region and the corresponding locations.
 * @param {Array<string>} locations
 */
export const getLocationsByRegion = locations =>
  locations.reduce((obj, id) => {
    if (!id) return obj
    const r = getRegionFromLocationId(id)
    if (!obj[r]) {
      obj[r] = []
    }
    obj[r].push(id)
    return obj
  }, {})

export const getLocationIdsForRegion = (region, locations) => {
  return locations.filter(
    id => id.length === getRegionById(region).idLength
  )
}

/**
 * Get the size filter for region
 * @param {*} regionId
 */
export const getSizesForRegion = regionId => {
  switch (regionId) {
    case 'counties':
      return [10, 50, 100, 500]
    case 'districts':
      return [10, 50, 100, 500, 1000]
    case 'schools':
      return [50, 100, 500, 1000, 5000]
    default:
      return []
  }
}
