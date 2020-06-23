import create from 'zustand'
import produce from 'immer'
import * as merge from 'deepmerge'

import { fetchScatterplotVars, fetchReducedPair } from './utils'
import { getMissingVarNames, getBaseVars } from './selectors'

const VARS_ENDPOINT =
  process.env.REACT_APP_DATA_ENDPOINT + 'scatterplot/'

const [useScatterplotStore] = create((set, get, api) => ({
  loading: false,
  data: {
    states: {},
    counties: {},
    districts: {},
    schools: {}
  },
  loadData: (vars, regionId, stateId) => {
    const neededVars = getMissingVarNames(
      get().data[regionId],
      regionId,
      vars
    )
    if (neededVars.length === 0) return
    set({ loading: true })
    const collectionVars = getBaseVars()[regionId] || []
    const promises = [
      fetchScatterplotVars(
        neededVars,
        regionId,
        VARS_ENDPOINT,
        collectionVars,
        stateId
      )
    ]
    if (regionId === 'schools') {
      // get xVar and yVar from needeVars
      const pairVars = neededVars.filter(
        varName =>
          varName.indexOf('sz') === -1 &&
          varName.indexOf('name') === -1
      )
      console.log('pair vars', pairVars)
      promises.push(fetchReducedPair(VARS_ENDPOINT, ...pairVars))
    }
    Promise.all(promises).then(dataArray => {
      const data = merge.all(dataArray)
      set(
        produce(state => {
          state.data[regionId] = merge(
            state.data[regionId],
            data
          )
          state.loading = false
        })
      )
    })
  }
}))

export default useScatterplotStore
