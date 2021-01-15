import create from 'zustand'
import Axios from 'axios'
import { csvParse, autoType } from 'd3-dsv'
import performance from '../performance'
import logger from '../logger'

const ENDPOINT = process.env.REACT_APP_DATA_ENDPOINT
const DATA_ENDPOINT = ENDPOINT + 'data'

/**
 *
 * @param {*} region
 */
const loadDataSet = (
  dataSetId,
  parser = autoType,
  endpoint = DATA_ENDPOINT
) => {
  const url = endpoint + '/' + dataSetId + '.csv'
  return Axios.get(url).then(res => {
    const parsed = csvParse(res.data, parser)
    return parsed
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
  loadDataSet: async (dataSetId, parser = autoType) => {
    const t0 = performance.now()
    set(state => ({
      loading: [...state.loading, dataSetId],
      isLoading: true
    }))
    const data = await loadDataSet(dataSetId, parser)
    // sort data by number of students (`all_sz`)
    data.sort((a, b) => b['all_sz'] - a['all_sz'])
    // HACK: rename `np_seg` to `pn_seg`, as it is a gap variable (not non-poor)
    // this can be removed when this issue is closed: https://github.com/Hyperobjekt/seda-etl/issues/35
    // mutates original to reduce performance impact
    HACK_FIX_NP_SEG(data)
    const loadTime = performance.now() - t0
    set(state => ({
      loading: state.loading.filter(v => v !== dataSetId),
      isLoading:
        state.loading.filter(v => v !== dataSetId).length > 0,
      loaded: [...state.loaded, dataSetId],
      data: { ...state.data, [dataSetId]: data },
      timing: {
        ...state.timing,
        [dataSetId]: loadTime
      }
    }))
    logger.debug('loaded data:', dataSetId, data, loadTime)
    return data
  }
}))

export default useStaticData
