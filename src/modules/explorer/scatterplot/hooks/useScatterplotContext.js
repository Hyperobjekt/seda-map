import { useMemo } from 'react'
import { useRegion } from '../../app/hooks'
import { useFilteredData } from '../../filters'
import { getDataExtent, getPaddedExtent } from '../selectors'
import useScatterplotVars from './useScatterplotVars'
import { hasVal } from '../utils'
import { getMidpointForVarName } from '../../app/selectors'
import { getBalancedExtent } from '../style'

export default function useScatterplotContext() {
  const data = useFilteredData()
  const vars = useScatterplotVars()
  const [region] = useRegion()

  return useMemo(() => {
    // get circles with valid values only
    const scatterplotData = data.filter(d =>
      vars.every(v => hasVal(d[v]))
    )
    const extents = [
      getDataExtent(scatterplotData, vars[0]),
      getDataExtent(scatterplotData, vars[1]),
      getDataExtent(scatterplotData, vars[2])
    ]
    const paddedExtents = extents.map(getPaddedExtent)
    const midpoints = [
      getMidpointForVarName(vars[0]),
      getMidpointForVarName(vars[1])
    ]
    return {
      data: scatterplotData,
      vars,
      region,
      // pad x and y extents for scatterplot
      extents: [paddedExtents[0], paddedExtents[1], extents[2]],
      // midpoints for x / y
      midpoints,
      // the diverging extent for colors for y values
      colorExtent: getBalancedExtent(midpoints[1], extents[1])
    }
  }, [data, vars])
}
