import LANG from './en'

/**
 * demographics data is available for
 */
export const DEMOGRAPHICS = [
  {
    id: 'all',
    label: LANG['LABEL_ALL'],
    regions: ['states', 'counties', 'districts', 'schools']
  },
  {
    id: 'w',
    label: LANG['LABEL_W'],
    regions: ['states', 'counties', 'districts']
  },
  {
    id: 'b',
    label: LANG['LABEL_B'],
    regions: ['states', 'counties', 'districts']
  },
  {
    id: 'h',
    label: LANG['LABEL_H'],
    regions: ['states', 'counties', 'districts']
  },
  // {
  //   id: 'i',
  //   label: LANG['LABEL_I'],
  //   regions: ['states', 'counties', 'districts']
  // },
  {
    id: 'a',
    label: LANG['LABEL_A'],
    regions: ['states', 'counties', 'districts']
  },
  {
    id: 'm',
    label: LANG['LABEL_M'],
    regions: ['states', 'counties', 'districts']
  },
  {
    id: 'f',
    label: LANG['LABEL_F'],
    regions: ['states', 'counties', 'districts']
  },
  {
    id: 'p',
    label: LANG['LABEL_P'],
    regions: ['states', 'counties', 'districts']
  },
  {
    id: 'np',
    label: LANG['LABEL_NP'],
    regions: ['states', 'counties', 'districts']
  }
]

/**
 * gaps data is available for
 */
export const GAPS = [
  {
    id: 'wb',
    label: LANG['LABEL_WB'],
    regions: ['states', 'counties', 'districts']
  },
  {
    id: 'wh',
    label: LANG['LABEL_WH'],
    regions: ['states', 'counties', 'districts']
  },
  // {
  //   id: 'wi',
  //   label: LANG['LABEL_WI'],
  //   regions: ['states', 'counties', 'districts']
  // },
  {
    id: 'pn',
    label: LANG['LABEL_PN'],
    regions: ['states', 'counties', 'districts']
  },
  {
    id: 'mf',
    label: LANG['LABEL_MF'],
    regions: ['states', 'counties', 'districts']
  }
]

if (process.env.REACT_APP_EMBARGOED) {
  const dem = {
    id: 'i',
    label: LANG['LABEL_I'],
    regions: ['states', 'counties', 'districts']
  }
  const gap = {
    id: 'wi',
    label: LANG['LABEL_WI'],
    regions: ['states', 'counties', 'districts']
  }
  DEMOGRAPHICS.splice(4, 0, dem)
  GAPS.splice(2, 0, gap)
}
