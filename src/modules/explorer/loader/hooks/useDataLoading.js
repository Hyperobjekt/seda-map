import { useEffect, useMemo } from 'react'
import shallow from 'zustand/shallow'
import { useStaticData } from '../../../data'
import { useDataOptions } from '../../app/hooks'
import useLoadSedaData from './useLoadSedaData'

export default function useDataLoading() {
  const loadDataForRegion = useLoadSedaData()
  const [loaded, loading, isLoading] = useStaticData(
    state => [state.loaded, state.loading, state.isLoading],
    shallow
  )
  const [region, dataOptionsLoading] = useDataOptions(state => [state.region, state.loading])
  useEffect(() => {
    !dataOptionsLoading && loadDataForRegion(region)
  }, [loadDataForRegion, region, dataOptionsLoading])
  return useMemo(() => {
    return [loading, loaded, isLoading]
  }, [loading, loaded, isLoading])
}
