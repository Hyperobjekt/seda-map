import { useEffect } from 'react'
import { useStaticData } from '../../../data'
import { useDataOptions } from '../../app/hooks'
import useLoadSedaData from './useLoadSedaData'

export default function useDataLoading() {
  const loadDataForRegion = useLoadSedaData()
  const loaded = useStaticData(state => state.loaded)
  const loading = useStaticData(state => state.loading)
  const region = useDataOptions(state => state.region)
  useEffect(() => {
    loadDataForRegion(region)
  }, [loadDataForRegion, region])
  return [loading, loaded]
}
