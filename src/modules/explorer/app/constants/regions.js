import LANG from './en'

/**
 * regions data is available for
 */
export const REGIONS = [
  {
    id: 'states',
    label: 'States',
    singular: 'State',
    idLength: 2
  },
  {
    id: 'counties',
    label: LANG['LABEL_COUNTIES'],
    singular: LANG['LABEL_COUNTIES_SINGULAR'],
    idLength: 5
  },
  {
    id: 'districts',
    label: LANG['LABEL_DISTRICTS'],
    singular: LANG['LABEL_DISTRICTS_SINGULAR'],
    idLength: 7
  },
  {
    id: 'schools',
    label: LANG['LABEL_SCHOOLS'],
    singular: LANG['LABEL_SCHOOLS_SINGULAR'],
    idLength: 12
  }
]

/** data ranges to map to size ranges on chart */
export const REGION_DOMAINS = {
  all_states: [10, 200000],
  b_states: [10, 75000],
  w_states: [1, 10000],
  h_states: [10, 75000],
  i_states: [3, 5000],
  a_states: [3, 5000],
  f_states: [3, 50000],
  m_states: [3, 50000],
  p_states: [3, 80000],
  np_states: [3, 30000],
  wb_states: [9, 320000],
  wh_states: [5, 920000],
  wi_states: [3, 340000],
  wa_states: [3, 340000],
  pn_states: [6, 1160000],
  mf_states: [6, 1150000],
  all_counties: [3, 110000],
  b_counties: [3, 21000],
  w_counties: [3, 22000],
  h_counties: [3, 75000],
  i_counties: [3, 3000],
  a_counties: [3, 10000],
  f_counties: [3, 56000],
  m_counties: [3, 59000],
  p_counties: [3, 81000],
  np_counties: [3, 34000],
  wb_counties: [9, 32000],
  wh_counties: [5, 92000],
  wi_counties: [5, 34000],
  wa_counties: [3, 34000],
  pn_counties: [6, 116000],
  mf_counties: [6, 115000],
  all_districts: [2, 71000],
  b_districts: [2, 21000],
  w_districts: [2, 10000],
  h_districts: [2, 36000],
  i_districts: [1, 2000],
  a_districts: [2, 10000],
  f_districts: [2, 35000],
  m_districts: [2, 35000],
  p_districts: [2, 60000],
  np_districts: [2, 11000],
  wb_districts: [4, 31000],
  wh_districts: [4, 41000],
  wi_districts: [2, 11000],
  wa_districts: [2, 11000],
  pn_districts: [4, 71000],
  mf_districts: [4, 71000],
  schools: [10, 1000]
}

/** Maps region id to the length of identifier */
export const REGION_TO_ID_LENGTH = {
  states: 2,
  counties: 5,
  districts: 7,
  schools: 12
}

/** Maps the length of identifier to region ID */
export const ID_LENGTH_TO_REGION = {
  2: 'states',
  5: 'counties',
  7: 'districts',
  12: 'schools'
}

export const REGION_SIZE_FILTERS = {
  states: [5, 10, 25, 50],
  counties: [10, 100, 500, 1000],
  districts: [10, 100, 1000, 5000],
  schools: [100, 1000, 5000, 10000]
}
