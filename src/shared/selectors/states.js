import WebMercatorViewport from 'viewport-mercator-project'
import { STATES } from '../constants/states'

/**
 * Gets the property for the given identifier.
 * @param {string} id identifier for any geography
 * @param {string} prop property name to get from the states object
 */
export const getStateProp = (id, prop) => {
  if (typeof id !== 'string') {
    throw new Error('state identifier must be string')
  }
  if (id.length > 2) {
    id = id.substring(0, 2)
  }
  return STATES[id] && STATES[id][prop] ? STATES[id][prop] : null
}

/**
 * Get the state for this given fips code
 * @param {*} id fips code for the state
 */
export const getState = id => {
  return STATES[id]
}

/**
 * Gets the state abbreviation for the provided identifier
 * @param {string} id identifier for any geography
 */
export const getStateAbbr = id => getStateProp(id, 'abbr')

export const getStateAbbrFromName = name => {
  const stateKey = Object.keys(STATES).find(
    fips =>
      STATES[fips].full.toLowerCase() === name.toLowerCase()
  )
  return stateKey ? STATES[stateKey].abbr.toLowerCase() : 'us'
}

/**
 * Gets the state name for the provided identifier
 * @param {string} id identifier for any geography
 */
export const getStateName = id => getStateProp(id, 'full')

export const getStateNameFromAbbr = abbr => {
  const fips = getStateFipsFromAbbr(abbr)
  return STATES[fips].full
}

/**
 * Gets a list of state options for `<Select />`
 */
export const getStateSelectOptions = () =>
  Object.keys(STATES)
    .map(fips => ({
      id: STATES[fips]['abbr'].toLowerCase(),
      label: STATES[fips]['full']
    }))
    .sort((a, b) =>
      a.label < b.label ? -1 : a.label > b.label ? 1 : 0
    )

export const getStateFipsFromAbbr = abbr => {
  if (!abbr || abbr === 'us') {
    return null
  }
  return Object.keys(STATES).find(
    fips =>
      STATES[fips].abbr.toUpperCase() === abbr.toUpperCase()
  )
}

export const getStatePropByAbbr = (abbr, prop) => {
  const stateFips = getStateFipsFromAbbr(abbr)
  return stateFips ? getStateProp(stateFips, prop) : null
}

const getStateBoundingBoxByAbbr = abbr => {
  const fips = getStateFipsFromAbbr(abbr)

  const state = fips
    ? STATES[fips]
    : {
        xmin: -125.0011,
        ymin: 24.9493,
        xmax: -66.9326,
        ymax: 49.5904
      }
  return [[state.xmin, state.ymin], [state.xmax, state.ymax]]
}

export const getStateViewport = (abbr, { width, height }) => {
  // const viewport = new WebMercatorViewport({ width, height })
  // const bound = viewport.fitBounds(
  //   getStateBoundingBoxByAbbr(abbr),
  //   { padding: 20 }
  // )
  // return bound
}
