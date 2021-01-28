/**
 * Filter flags available for location types
 */
export const FILTER_FLAGS = {
  states: [],
  counties: [],
  districts: [['r', 't', 's', 'u']],
  schools: [['r', 't', 's', 'u'], ['m', 'e', 'c']]
}

export const FILTER_RADIOS = {
  states: [],
  counties: [],
  districts: [],
  schools: [['ch', 'mg']]
}

// these flags only show locations with corresponding flags when active
// not currently in use, but was used for BIE filter, and left in incase
// the functionality is required in the future
export const EXCLUSIVE_FLAGS = ['ch', 'mg']

if (process.env.REACT_APP_EMBARGOED) {
  // FILTER_FLAGS['schools'].push(['bie'])
  FILTER_RADIOS['schools'][0].push('bie')
  EXCLUSIVE_FLAGS.push('bie')
}
