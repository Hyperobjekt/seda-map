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
      map_counties: [-3, 3],
      map_districts: [-3.5, 3.5],
      map_schools: [-5, 5],
      '*_states_b': [-2.5, 0.5],
      '*_states_h': [-2, 0.5],
      '*_states_p': [-2.5, 0.5],
      '*_states_np': [-1, 2],
      '*_states_wb': [-1, 4],
      '*_states_wh': [-1, 4],
      '*_states': [-1.5, 1.5],
      '*_counties_np': [-4, 3],
      '*_counties_wh': [-1.5, 4.5],
      '*_districts_wh': [-1.5, 5],
      '*_*_gap': [-0.5, 5],
      '*_counties_b': [-4, 2],
      '*_counties_w': [-4, 4],
      '*_counties_a': [-4, 5],
      '*_counties': [-4.5, 2.5],
      '*_districts_b': [-4, 3],
      '*_districts_w': [-4, 4],
      '*_districts_a': [-4, 5],
      '*_districts': [-4.5, 4.5],
      '*_schools': [-8, 7]
    },
    map: true,
    scatterplot: true
  },
  {
    id: 'grd',
    label: LANG['LABEL_GRD'],
    range: {
      'map_*_gap': [-0.4, 0.4],
      'map_*_*': [0.5, 1.5],
      '*_states_a': [0.9, 1.5],
      // '*_states_h': [-2, 0.5],
      // '*_states_p': [-2.5, 0.5],
      // '*_states_np': [-1, 2],
      // '*_states_wb': [-1, 4],
      // '*_states_wh': [-1, 4],
      '*_schools': [-0.2, 2.6],
      '*_*_b': [0.4, 1.4],
      '*_*_wb': [-0.3, 0.45],
      '*_*_gap': [-0.4, 0.4],
      '*_states': [0.7, 1.3],
      '*': [0.4, 1.6]
    },
    map: true,
    scatterplot: true
  },
  {
    id: 'coh',
    label: LANG['LABEL_COH'],
    range: {
      'map_states_*': [-0.25, 0.25],
      'map_*_*': [-0.333, 0.3333],
      '*_states': [-0.25, 0.25],
      '*_*_gap': [-0.25, 0.25],
      '*_schools': [-1, 1],
      '*': [-0.5, 0.5]
    },
    map: true,
    scatterplot: true
  },
  {
    id: 'ses',
    label: LANG['LABEL_SES_NO_REGION'],
    map: false,
    scatterplot: true,
    range: {
      '*_states_b': [-4, 0.5],
      '*_states_h': [-3, 0.5],
      '*_states_wb': [-1, 4],
      '*_states_wh': [-1, 4],
      '*_states': [-2, 2],
      '*_districts_h': [-5, 3],
      '*_counties_h': [-4, 2],
      '*_*_b': [-6, 2],
      '*_*_h': [-6, 2],
      '*_districts_wb': [-1, 6],
      '*_*_wb': [0, 5],
      '*_districts_wh': [-1, 5],
      '*_*_wh': [-0.5, 4.5],
      'map_*_*': [-3, 3],
      '*_counties': [-4, 3],
      '*_districts_w': [-3, 3],
      '*_districts': [-5, 3],
      '*': [-5, 4]
    }
  },
  {
    id: 'seg',
    label: LANG['LABEL_SEG'],
    range: {
      '*_*_np': [0, 0.75],
      '*': [-0.25, 0.75]
    },
    map: false,
    scatterplot: true
  },
  {
    id: 'min',
    label: LANG['LABEL_MIN'],
    range: {
      '*': [-0.1, 0.7]
    }
  },
  {
    id: 'frl',
    label: LANG['LABEL_FRL'],
    range: {
      '*': [0, 1]
    },
    map: false,
    scatterplot: true
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
