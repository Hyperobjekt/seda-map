import create from 'zustand'
import Axios from 'axios'
import { csvParse, autoType } from 'd3-dsv'

const ENDPOINT = process.env.REACT_APP_DATA_ENDPOINT

/**
 *
 * @param {*} region
 */
const loadDataForRegion = (region, parser = autoType) => {
  const dataEndpoint = ENDPOINT + 'data'
  const url = dataEndpoint + '/' + region + '.csv'
  return Axios.get(url).then(res => {
    const parsed = csvParse(res.data, parser)
    return parsed
  })
}

const [useStaticData] = create((set, get) => ({
  states: [],
  counties: [],
  districts: [],
  schools: [],
  loading: [],
  loaded: [],
  timing: {},
  loadDataForRegion: async (region, parser = autoType) => {
    const t0 = performance.now()
    set(state => ({ loading: [...state.loading, region] }))
    const data = await loadDataForRegion(region, parser)
    set(state => ({
      loading: state.loading.filter(v => v !== region),
      loaded: [...state.loaded, region],
      [region]: data,
      timing: {
        ...state.timing,
        [region]: performance.now() - t0
      }
    }))
    console.log(region, data)
    return data
  }
}))

export default useStaticData
