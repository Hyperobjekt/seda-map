/**
 * Filter flags available for location types
 */
export const FILTER_FLAGS = {
  states: [],
  counties: [],
  districts: [['r', 't', 's', 'u']],
  schools: [
    ['r', 't', 's', 'u'],
    ['rg', 'ch', 'mg', 'bie'],
    ['m', 'e', 'c']
  ]
}

export const ALL_FILTER_FLAGS = [
  ['r', 't', 's', 'u'],
  ['rg', 'ch', 'mg', 'bie'],
  ['m', 'e', 'c']
]

// add BIE filter to embargoed
// FILTER_FLAGS['schools'][1].push(['bie'])

// these flags only show locations with corresponding flags when active
// not currently in use, but was used for BIE filter, and left in incase
// the functionality is required in the future
export const EXCLUSIVE_FLAGS = []
