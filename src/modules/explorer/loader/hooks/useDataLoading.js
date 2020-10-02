import { useEffect } from 'react'
import { autoType } from 'd3-dsv'
import { useStaticData } from '../../../data'
import { useDataOptions } from '../../app/hooks'

/** Parser for data, ensures ID stays a string */
const SEDA_PARSER = ({ id, ...rest }) => {
  return { id, ...autoType(rest) }
}

export default function useDataLoading() {
  const loadDataForRegion = useStaticData(
    state => state.loadDataSet
  )
  const loaded = useStaticData(state => state.loaded)
  const loading = useStaticData(state => state.loading)
  const region = useDataOptions(state => state.region)
  useEffect(() => {
    if (
      loaded.indexOf(region) === -1 &&
      loading.indexOf(region) === -1
    )
      loadDataForRegion(region, SEDA_PARSER)
  }, [loaded, loadDataForRegion, region])
  return [loading, loaded]
}
