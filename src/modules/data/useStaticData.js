import create from 'zustand'
import performance from '../performance'
import logger from '../logger'
import { readRemoteFile } from 'react-papaparse'

const ENDPOINT = process.env.REACT_APP_DATA_ENDPOINT
const DATA_ENDPOINT = ENDPOINT + 'data'

const AUTO_PARSE_COLS = {
  id: false,
  lon: true,
  lat: true,
  all_ses: true,
  w_ses: true,
  b_ses: true,
  h_ses: true,
  i_ses: true,
  wb_ses: true,
  wh_ses: true,
  wi_ses: true,
  wb_seg: true,
  wh_seg: true,
  wb_min: true,
  wh_min: true,
  u: true,
  s: true,
  t: true,
  r: true,
  name: false,
  all_sz: true,
  all_avg: true,
  all_avg_e: true,
  all_grd: true,
  all_grd_e: true,
  all_coh: true,
  all_coh_e: true,
  a_sz: true,
  a_avg: true,
  a_avg_e: true,
  a_grd: true,
  a_grd_e: true,
  a_coh: true,
  a_coh_e: true,
  b_sz: true,
  b_avg: true,
  b_avg_e: true,
  b_grd: true,
  b_grd_e: true,
  b_coh: true,
  b_coh_e: true,
  p_sz: true,
  p_avg: true,
  p_avg_e: true,
  p_grd: true,
  p_grd_e: true,
  p_coh: true,
  p_coh_e: true,
  f_sz: true,
  f_avg: true,
  f_avg_e: true,
  f_grd: true,
  f_grd_e: true,
  f_coh: true,
  f_coh_e: true,
  h_sz: true,
  h_avg: true,
  h_avg_e: true,
  h_grd: true,
  h_grd_e: true,
  h_coh: true,
  h_coh_e: true,
  m_sz: true,
  m_avg: true,
  m_avg_e: true,
  m_grd: true,
  m_grd_e: true,
  m_coh: true,
  m_coh_e: true,
  mf_sz: true,
  mf_avg: true,
  mf_avg_e: true,
  mf_grd: true,
  mf_grd_e: true,
  mf_coh: true,
  mf_coh_e: true,
  i_sz: true,
  i_avg: true,
  i_avg_e: true,
  i_grd: true,
  i_grd_e: true,
  i_coh: true,
  i_coh_e: true,
  np_sz: true,
  np_avg: true,
  np_avg_e: true,
  np_grd: true,
  np_grd_e: true,
  np_coh: true,
  np_coh_e: true,
  wa_sz: true,
  pn_sz: true,
  pn_avg: true,
  pn_avg_e: true,
  pn_grd: true,
  pn_grd_e: true,
  pn_coh: true,
  pn_coh_e: true,
  wa_avg: true,
  wa_avg_e: true,
  wa_grd: true,
  wa_grd_e: true,
  wa_coh: true,
  wa_coh_e: true,
  wb_sz: true,
  wb_avg: true,
  wb_avg_e: true,
  wb_grd: true,
  wb_grd_e: true,
  wb_coh: true,
  wb_coh_e: true,
  wh_sz: true,
  wh_avg: true,
  wh_avg_e: true,
  wh_grd: true,
  wh_grd_e: true,
  wh_coh: true,
  wh_coh_e: true,
  w_sz: true,
  w_avg: true,
  w_avg_e: true,
  w_grd: true,
  w_grd_e: true,
  w_coh: true,
  w_coh_e: true,
  wi_sz: true,
  wi_avg: true,
  wi_avg_e: true,
  wi_grd: true,
  wi_grd_e: true,
  wi_coh: true,
  wi_coh_e: true,
  pn_seg: true,
  all_frl: true,
  e: true,
  m: true,
  c: true,
  ch: true,
  mg: true,
  bie: true,
  fid: true
}
/**
 *
 * @param {*} region
 */
const loadDataSet = (dataSetId, insertData, options = {}) => {
  const url = DATA_ENDPOINT + '/' + dataSetId + '.csv'
  // const result = []
  return new Promise((resolve, reject) => {
    readRemoteFile(url, {
      header: true,
      worker: true,
      dynamicTyping: AUTO_PARSE_COLS,
      // for streaming data:
      // step: row => {
      //   // insertData(dataSetId, [row.data])
      //   // const id = row.data.id
      //   result.push(row.data)
      // },
      complete: results => {
        resolve(results.data)
      },
      error: error => {
        console.error(error)
        reject(error)
      },
      ...options
    })
  })
}

/**
 * Renames `np_seg` data attribute to `pn_seg` due to pipeline error
 * @param {*} data
 */
const HACK_FIX_NP_SEG = data => {
  if (
    data &&
    data[0] &&
    Object.keys(data[0]).indexOf('np_seg') > -1
  ) {
    for (let i = 0; i < data.length; i++) {
      data[i]['pn_seg'] = data[i]['np_seg']
      delete data[i]['np_seg']
    }
  }
}

const [useStaticData] = create((set, get) => ({
  data: {},
  loading: [],
  loaded: [],
  timing: {},
  isLoading: false,
  insertData: (dataSetId, rows) => {
    set(state => {
      const currentData = state.data[dataSetId] || []
      const newData = [...currentData, ...rows].sort(
        (a, b) => b['all_sz'] - a['all_sz']
      )
      return { data: { ...state.data, [dataSetId]: newData } }
    })
  },
  loadDataSet: async dataSetId => {
    const t0 = performance.now()
    set(state => ({
      loading: [...state.loading, dataSetId],
      isLoading: true
    }))
    const data = await loadDataSet(dataSetId, get().insertData)
    const filterBIE =
      dataSetId === 'schools' && !process.env.REACT_APP_EMBARGOED
    let filteredData = []
    // TEMPORARY: filter out BIE schools on non-embargoed link
    if (filterBIE) {
      const total = data.length
      filteredData = data.filter(d => !d.bie)
      const filteredTotal = filteredData.length
      console.debug(
        `filtered ${total -
          filteredTotal} schools out of dataset`
      )
    }
    const dataStore = filterBIE ? filteredData : data
    // sort data by number of students (`all_sz`)
    dataStore.sort((a, b) => b['all_sz'] - a['all_sz'])
    // HACK: rename `np_seg` to `pn_seg`, as it is a gap variable (not non-poor)
    // this can be removed when this issue is closed: https://github.com/Hyperobjekt/seda-etl/issues/35
    // mutates original to reduce performance impact
    HACK_FIX_NP_SEG(dataStore)

    const loadTime = performance.now() - t0
    set(state => ({
      loading: state.loading.filter(v => v !== dataSetId),
      isLoading:
        state.loading.filter(v => v !== dataSetId).length > 0,
      loaded: [...state.loaded, dataSetId],
      data: { ...state.data, [dataSetId]: dataStore },
      timing: {
        ...state.timing,
        [dataSetId]: loadTime
      }
    }))
    logger.debug('loaded data:', dataSetId, dataStore, loadTime)
    return dataStore
  }
}))

export default useStaticData
