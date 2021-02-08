import { getStateName } from '../../../shared/utils/states'
import {
  INACTIVE_COLOR,
  SELECTED_COLORS
} from '../app/constants/colors'
import { getRegionFromLocationId } from '../app/selectors'
import { getRegionById } from '../app/selectors/regions'
import { getLang } from '../app/selectors/lang'

/**
 * Returns an array with [{LOCATION_NAME}, {LOCATION_PARENT}] given the location data
 * (e.g. ["Ellis County", "Kansas"])
 * @param {object} location object of location data
 */
export const getLocationNameParts = location => {
  if (!location || !location.id) {
    return [getLang('LABEL_NO_NAME'), '']
  }
  const id = location.id
  const isState = id.length === 2
  const name = isState ? getStateName(id) : location['name']
  const parent = isState ? 'United States' : getStateName(id)
  return [name || getLang('LABEL_NO_NAME'), parent]
}

/**
 * Returns the location name as a string (e.g. Ellis County, Kansas)
 * @param {object} location
 */
export const getLocationNameString = location => {
  return getLocationNameParts(location).join(', ')
}

/**
 * Returns the provided location IDs array as an object
 * with a key for each region and the corresponding locations.
 * @param {Array<string|object>} locations
 */
export const getLocationsByRegion = (
  locations,
  options = { isObjectArray: false }
) => {
  // if locations are objects, pull the ids out
  const sourceLocations = options.isObjectArray
    ? locations.map(l => l.id)
    : locations
  return sourceLocations.reduce((obj, id, i) => {
    if (!id) return obj
    const r = getRegionFromLocationId(id)
    if (!obj[r]) {
      obj[r] = []
    }
    // push the original location type to the result (id or location object)
    obj[r].push(locations[i])
    return obj
  }, {})
}

/**
 * Takes a region ID and array of locations and returns locations that belong to the provided
 * @param {string} region string id of the region (e.g. 'counties')
 * @param {Array<string|object>} locations an array of location ids (or objects is isObjectArray option is set)
 * @param {object} options { isObjectArray }
 */
export const getLocationIdsForRegion = (
  region,
  locations,
  options = { isObjectArray: false }
) => {
  // if locations are objects, pull the ids out
  if (options.isObjectArray) locations = locations.map(l => l.id)
  return locations.filter(
    id => id.length === getRegionById(region).idLength
  )
}

/**
 * Gets the location data, with marker data added to it (number, color )
 * @param {Array<object>} locations
 * @param {string} id
 */
export const getLocationMarker = (
  locations,
  id,
  activeRegion
) => {
  const getResult = number => ({
    number,
    color: getLocationColor(number)
  })
  if (!locations || !id) return getResult(0)
  const locationRegions = getLocationsByRegion(locations)
  const region = getRegionFromLocationId(id)
  // 0 if active region is provided, and location is not a member
  if (activeRegion && region !== activeRegion)
    return getResult(0)
  // no locations for the current region
  if (!locationRegions[region]) return getResult(0)
  const number =
    locationRegions[region].findIndex(l => l === id) + 1
  return getResult(number)
}

export const getLocationColor = (locationNumber = 0) => {
  if (!locationNumber || locationNumber < 1)
    return INACTIVE_COLOR
  return SELECTED_COLORS[
    (locationNumber - 1) % SELECTED_COLORS.length
  ]
}
