import LANG from "./lang";

/** min / max dot sizes */
export const DOT_SIZES = [ 6, 48 ]

/**
 * default viewport on map view
 */
export const DEFAULT_VIEWPORT = {
  latitude: 37.39,
  longitude: -96.78,
  zoom: 3.15
}

/**
 * default vars for each section
 */
export const SECTIONS = {
  'map': {
    xVar: 'all_ses',
    yVar: 'all_avg',
    zVar: 'sz',
  },
  'socioeconomic': {
    xVar: 'all_ses',
    yVar: 'all_avg',
    zVar: 'sz',
  },
  'opportunity': {
    xVar: 'np_avg',
    yVar: 'p_avg',
    zVar: 'sz',
  },
  'achievement': {
    xVar: 'wb_ses',
    yVar: 'wb_avg',
    zVar: 'sz',
  }
}

/**
 * Variables contained in the base csv file for each region
 */
export const BASE_VARS = {
  'counties': ['id', 'name', 'lat', 'lon', 'all_avg', 'all_ses', 'sz' ],
  'districts': ['id', 'name', 'lat', 'lon', 'all_avg', 'all_ses', 'sz' ],
  'schools': ['id', 'name', 'lat', 'lon', 'all_avg', 'frl_pct', 'sz' ]
}

/**
 * Colors for selected locations
 */
export const SELECTED_COLORS = [
  '#ff9233', 
  '#fbff00', 
  '#3dcc82', 
  '#00e2e6', 
  '#2967cc', 
  '#171ae6', 
  '#a329cc'
].reverse();

/**
 * colors for map choropleths
 */
export const CHOROPLETH_COLORS = [
  '#37469C', 
  '#3561A8', 
  '#519DD4', 
  '#68C5D0', 
  '#A2E2D4', 
  '#E5F8C1', 
  '#F9FECC'
];

/**
 * Data metrics in the SEDA data set
 */
export const METRICS = [
  {
    id: 'avg',
    label: LANG['LABEL_AVG'],
    description: LANG['EXPLAINER_AVG'],
    range: {
      'default': [ -4, 4 ],
      'gap': [ -8, 1 ]
    },
    map: true,
    scatterplot: true,
  },
  {
    id: 'grd',
    label: LANG['LABEL_GRD'],
    description: LANG['EXPLAINER_GRD'],
    range: {
      'default': [ 0.4, 1.6 ],
      'gap': [ -0.5, 0.5 ]
    },
    map: true,
    scatterplot: true,
  },
  {
    id: 'coh',
    label: LANG['LABEL_COH'],
    description: LANG['EXPLAINER_COH'],
    range: {
      'default': [ -0.3, 0.3 ]
    },
    map: true,
    scatterplot: true,
  },
  {
    id: 'ses',
    label: LANG['LABEL_SES'],
    description: LANG['EXPLAINER_SES'],
    map: false,
    scatterplot: true,
    range: {
      'default': [ -5, 4 ],
      'b': [ -14, 5 ],
      'h': [ -16, 5 ]
    }
  },
  {
    id: 'seg',
    label: LANG['LABEL_SEG'],
    description: LANG['EXPLAINER_SEG'],
    range: {
      'default': [ -5, 5 ],
      
    },
    map: false,
    scatterplot: true
  }
]

/**
 * regions data is available for
 */
export const REGIONS = [
  {
    id: 'counties',
    label: LANG['LABEL_COUNTIES']
  },
  {
    id: 'districts',
    label: LANG['LABEL_DISTRICTS']
  },
  {
    id: 'schools',
    label: LANG['LABEL_SCHOOLS']
  }
];

/**
 * demographics data is available for
 */
export const DEMOGRAPHICS = [
  {
    id: 'all',
    label: LANG['LABEL_ALL']
  },
  {
    id: 'w',
    label: LANG['LABEL_W']
  },
  {
    id: 'b',
    label: LANG['LABEL_B']
  },
  {
    id: 'h',
    label: LANG['LABEL_H']
  },
  {
    id: 'a',
    label: LANG['LABEL_A']
  },
  {
    id: 'm',
    label: LANG['LABEL_M']
  },
  {
    id: 'f',
    label: LANG['LABEL_F']
  },
  {
    id: 'p',
    label: LANG['LABEL_P']
  },
  {
    id: 'np',
    label: LANG['LABEL_NP']
  },
]

/**
 * gaps data is available for
 */
export const GAPS = [
  {
    id: 'wb',
    label: LANG['LABEL_WB']
  },
  {
    id: 'wh',
    label: LANG['LABEL_WH']
  },
  {
    id: 'wa',
    label: LANG['LABEL_WA']
  },
  {
    id: 'pn',
    label: LANG['LABEL_PN']
  }
]