// Gets closest parent of element with selector
import WebMercatorViewport from 'viewport-mercator-project'

import { STATES } from '../../shared/constants/states'
import { getStateFipsFromAbbr } from '../../shared/utils/states'

const getStateBoundingBoxByFips = fips => {
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

/**
 * Returns the bounding box for a state given the abbreviation
 * @param {*} abbr
 */
const getStateBoundingBoxByAbbr = abbr => {
  const fips = getStateFipsFromAbbr(abbr)
  return getStateBoundingBoxByFips(fips)
}

/**
 * Returns a viewport for the provided abbreviation and viewport width / height
 * @param {*} abbr
 * @param {*} param1
 */
export const getStateViewport = (abbr, { width, height }) => {
  const viewport = new WebMercatorViewport({ width, height })
  const bound = viewport.fitBounds(
    getStateBoundingBoxByAbbr(abbr),
    { padding: 20 }
  )
  return bound
}

/**
 * Returns a viewport for the provided abbreviation and viewport width / height
 * @param {*} abbr
 * @param {*} param1
 */
export const getStateViewportByFips = (
  fips,
  { width, height }
) => {
  const viewport = new WebMercatorViewport({ width, height })
  const bound = viewport.fitBounds(
    getStateBoundingBoxByFips(fips),
    { padding: 20 }
  )
  return bound
}
