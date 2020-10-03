import { useEffect, useCallback } from 'react'
import { autoType } from 'd3-dsv'
import { useStaticData } from '../../../data'
import { useDataOptions } from '../../app/hooks'

/** Parser for data, ensures ID stays a string */
const SEDA_PARSER = ({ id, ...rest }) => {
  return { id, ...autoType(rest) }
}

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
        loadDataSet(region, SEDA_PARSER)
    },
    [loaded, loading, loadDataSet]
  )
}
