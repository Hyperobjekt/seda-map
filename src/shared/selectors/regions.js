import {
  REGIONS,
  REGION_DOMAINS,
  ID_LENGTH_TO_REGION
} from '../constants/regions'

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
  REGIONS.map(r => ({ id: r.id, label: r.singular }))

/** Gets a region with singular name (e.g. "county" instead of "counties") */
export const getSingularRegion = rId =>
  rId ? REGIONS.find(r => rId === r.id).singular : ''

/** Gets the domain for the given region */
export const getRegionDomain = (demographic, region) =>
  region === 'schools'
    ? REGION_DOMAINS['schools']
    : REGION_DOMAINS[demographic + '_' + region]

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
export const getRegionFromFeatureId = id => {
  if (!id) {
    return null
  }
  if (!ID_LENGTH_TO_REGION[id.length]) {
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
  return getRegionFromFeatureId(feature.properties.id)
}
