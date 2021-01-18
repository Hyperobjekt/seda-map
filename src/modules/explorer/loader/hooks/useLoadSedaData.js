import { useCallback } from 'react'
import { useStaticData } from '../../../data'

export default function useLoadSedaData() {
  const loadDataSet = useStaticData(state => state.loadDataSet)
  const loaded = useStaticData(state => state.loaded)
  const loading = useStaticData(state => state.loading)
  return useCallback(
    region => {
      if (
        loaded.indexOf(region) === -1 &&
        loading.indexOf(region) === -1
      )
        loadDataSet(region)
    },
    [loaded, loading, loadDataSet]
  )
}
