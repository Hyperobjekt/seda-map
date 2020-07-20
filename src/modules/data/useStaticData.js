import create from 'zustand'
import Axios from 'axios'
import { csvParse, autoType } from 'd3-dsv'

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
    console.log('got!', res)
    const parsed = csvParse(res.data, parser)
    return parsed
  })
}

const [useStaticData] = create((set, get) => ({
  data: {},
  loading: [],
  loaded: [],
  timing: {},
  loadDataSet: async (dataSetId, parser = autoType) => {
    const t0 = performance.now()
    set(state => ({
      loading: [...state.loading, dataSetId]
    }))
    const data = await loadDataSet(dataSetId, parser)
    set(state => ({
      loading: state.loading.filter(v => v !== dataSetId),
      loaded: [...state.loaded, dataSetId],
      data: { ...state.data, [dataSetId]: data },
      timing: {
        ...state.timing,
        [dataSetId]: performance.now() - t0
      }
    }))
    console.log(dataSetId, data)
    return data
  }
}))

export default useStaticData
