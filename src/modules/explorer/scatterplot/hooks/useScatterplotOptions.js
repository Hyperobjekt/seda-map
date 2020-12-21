import { useMemo } from 'react'
import { useStaticData } from '../../../data'
import { getScatterplotOptions } from '../style'
import useScatterplotContext from './useScatterplotContext'

export default function useScatterplotOptions(variant) {
  // scatterplot data store
  const {
    data,
    vars: [xVar, yVar, zVar],
    extents,
    colorExtent,
    region
  } = useScatterplotContext()

  // boolean indicating if data is loading
  const loading = useStaticData(state => state.isLoading)

  // memoize the scatterplot options
  return useMemo(() => {
    if (loading) return {}
    const newOptions = getScatterplotOptions(
      variant,
      data,
      { xVar, yVar, zVar, extents, colorExtent },
      [],
      region
    )
    return newOptions
  }, [xVar, yVar, zVar, region, variant, extents, data, loading])
}
