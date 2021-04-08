import axios from 'axios'
import create from 'zustand'
import shallow from 'zustand/shallow'
import { ID_LENGTH_TO_REGION } from '../constants/regions'

const FLAGGED_ENDPOINT =
  process.env.REACT_APP_DATA_ENDPOINT + 'flagged/'

const fixId = id => {
  if (Object.keys(ID_LENGTH_TO_REGION).indexOf(id.length.toString()) > -1)
    return '' + id
  return '0' + id
}

export const loadFlaggedData = type => {
  return axios.get(FLAGGED_ENDPOINT + type + '.json')
}

/**
 * loads flagged schools
 */
export const loadFlaggedLocations = () =>
  Promise.all(
    ['sped', 'lep', 'gifted', 'missing'].map(type => {
      return loadFlaggedData(type)
        .then(result => {
          return result.data.map(fixId)
        })
        .catch(error => {
          console.error('unable to load flag', type, error)
          window.SEDA.trackProblem(
            'error loading flagged locations'
          )
        })
    })
  )

const useFlagStore = create((set, get) => ({
  loaded: false,
  sped: [],
  lep: [],
  gifted: [],
  missing: [],
  set
}))

export default function useLocationFlags() {
  const {
    loaded,
    sped,
    lep,
    gifted,
    missing,
    set
  } = useFlagStore(state => state, shallow)
  if (!loaded) {
    loadFlaggedLocations().then(res => {
      set({
        loaded: true,
        sped: res[0],
        lep: res[1],
        gifted: res[2],
        missing: res[3]
      })
    })
  }
  return [sped, lep, gifted, missing]
}
