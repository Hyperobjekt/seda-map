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
