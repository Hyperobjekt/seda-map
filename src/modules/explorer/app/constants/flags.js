import { SHOW_NATIVE_AMERICAN } from "../selectors"

/**
 * Filter flags available for location types
 */
export const FILTER_FLAGS = {
  states: [],
  counties: [],
  districts: [['r', 't', 's', 'u']],
  schools: [['r', 't', 's', 'u'], ['ch', 'mg'], ['m', 'e', 'c']]
}

// these flags only show locations with corresponding flags when active
// not currently in use, but was used for BIE filter, and left in incase
// the functionality is required in the future
export const EXCLUSIVE_FLAGS = []

if (SHOW_NATIVE_AMERICAN) {
  FILTER_FLAGS['schools'].push(['bie'])
  EXCLUSIVE_FLAGS.push('bie')
}
