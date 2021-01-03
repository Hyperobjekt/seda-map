import LANG from './en'

/**
 * Data metrics in the SEDA data set
 */
export const METRICS = [
  {
    id: 'avg',
    label: LANG['LABEL_AVG'],
    range: {
      'map_*_gap': [-6, 6],
      map_states: [-2, 2],
      map_counties: [-3, 3],
      map_districts: [-3.5, 3.5],
      map_schools: [-5, 5]
    },
    regions: ['states', 'counties', 'districts', 'schools']
  },
  {
    id: 'grd',
    label: LANG['LABEL_GRD'],
    range: {
      'map_*_gap': [-0.4, 0.4],
      'map_states_*': [0.8, 1.2],
      'map_*_*': [0.5, 1.5]
    },
    regions: ['states', 'counties', 'districts', 'schools']
  },
  {
    id: 'coh',
    label: LANG['LABEL_COH'],
    range: {
      'map_states_*': [-0.25, 0.25],
      'map_*_*': [-0.333, 0.3333]
    },
    regions: ['states', 'counties', 'districts', 'schools']
  },
  {
    id: 'ses',
    label: LANG['LABEL_SES_NO_REGION'],
    map: false,
    scatterplot: true,
    range: {
      'map_*_*': [-3, 3]
    },
    regions: ['states', 'counties', 'districts']
  },
  {
    id: 'seg',
    label: LANG['LABEL_SEG'],
    range: {
      '*_*_np': [0, 0.75],
      '*': [-0.25, 0.75]
    },
    regions: ['states', 'counties', 'districts']
  },
  {
    id: 'min',
    label: LANG['LABEL_MIN'],
    range: {
      '*': [-0.1, 0.7]
    },
    regions: ['states', 'counties', 'districts']
  },
  {
    id: 'frl',
    label: LANG['LABEL_FRL'],
    range: {
      '*': [0, 1]
    },
    regions: ['schools']
  }
]

export const KEY_METRIC_IDS = ['avg', 'grd', 'coh']

export const DEFAULT_RANGES = {
  states: {
    avg: [-5, 5],
    grd: [0, 2],
    coh: [-0.5, 0.5],
    ses: [-2, 2],
    limit: 52
  },
  counties: {
    avg: [-5, 5],
    grd: [0, 2],
    coh: [-0.5, 0.5],
    ses: [-3, 3],
    limit: 3500
  },
  districts: {
    avg: [-5, 5],
    grd: [0, 2],
    coh: [-0.5, 0.5],
    ses: [-3, 3],
    limit: 15000
  },
  schools: {
    avg: [-5, 5],
    grd: [0, 2],
    coh: [-0.5, 0.5],
    frl: [0, 1],
    limit: 80000
  }
}
