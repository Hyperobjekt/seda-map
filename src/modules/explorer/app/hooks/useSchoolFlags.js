import axios from 'axios'
import create from 'zustand'
import shallow from 'zustand/shallow'

const FLAGGED_ENDPOINT =
  process.env.REACT_APP_DATA_ENDPOINT + 'flagged/'

export const loadFlaggedData = type => {
  return axios.get(FLAGGED_ENDPOINT + type + '.json')
}

/**
 * loads flagged schools
 */
export const loadFlaggedSchools = () => 
  Promise.all(
    ['sped', 'lep', 'gifted'].map(type => {
      return loadFlaggedData(type)
        .catch(error => {
          // dispatch(onLoadFlaggedError(error))
          window.SEDA.trackProblem(
            'error loading flagged schools'
          )
        })
    })
  )

const [useFlagStore] = create((set, get) => ({
  loaded: false,
  sped: [],
  lep: [],
  gifted: [],
  set
}))

export default function useSchoolFlags() {
  const { loaded, sped, lep, gifted, set } = useFlagStore(state => state, shallow)
  if (!loaded) {
    loadFlaggedSchools()
      .then(data => {
        set({
          loaded: true,
          sped: data[0],
          lep: data[1],
          gifted: data[2]
        })
      })
  }
  return [sped, lep, gifted]
}