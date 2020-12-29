import { useMemo } from 'react'
import { useDataOptions } from '.'
import { useFilteredData } from '../../filters'

import shallow from 'zustand/shallow'
import {
  getDataExtent,
  getPaddedExtent
} from '../../scatterplot/selectors'
import {
  getColorRangeForVarName,
  getDemographicIdFromVarName,
  getMidpointForVarName,
  getSecondaryForDemographic,
  getVarNames,
  isVersusFromVarNames
} from '../selectors'
import { hasVal } from '../../scatterplot/utils'

const MAX_DOTS = 2000

export default function useAppContext() {
  const data = useFilteredData()
  const [
    region,
    metric,
    secondary,
    demographic
  ] = useDataOptions(
    state => [
      state.region,
      state.metric,
      state.secondary,
      state.demographic
    ],
    shallow
  )

  return useMemo(() => {
    // variable names for the scatterplot
    const [scatterplotVars, gapVars, mapVars] = [
      'chart',
      'gap',
      'map'
    ].map(type =>
      getVarNames(region, metric, secondary, demographic, type)
    )

    // get circles with valid values only, limit to 20,000 dots
    const scatterplotData = data
      .filter(d => scatterplotVars.every(v => hasVal(d[v])))
      .slice(0, MAX_DOTS)

    // all variables used in the scatterplot / map
    const allVars = [
      ...scatterplotVars,
      ...mapVars,
      ...gapVars
    ].filter(
      (v, i, self) => self.indexOf(v) === i // keep unique values only
    )

    // add extents for all vars
    const dataExtents = {}
    allVars.forEach(v => {
      dataExtents[v] = getDataExtent(scatterplotData, v)
    })

    // create padded extents for the scatterplot
    const scatterplotExtents = scatterplotVars.map(v => {
      const extent = dataExtents[v]
      // pad extents that are not "size"
      return v.indexOf('sz') > -1
        ? extent
        : getPaddedExtent(extent, 0.05)
    })

    // add map data extents for fun
    const mapExtents = mapVars.map(v => dataExtents[v])

    // add gap data extents for gap charts
    const gapExtents = gapVars.map(v => dataExtents[v])

    // get midpoints for vars
    const midpoints = allVars.map(getMidpointForVarName)

    // true if the vars represent a subgroup vs. chart
    const isVersus = isVersusFromVarNames(
      scatterplotVars[0],
      scatterplotVars[1]
    )
    // get the demographic portion of the gap var name
    const gapDem = getDemographicIdFromVarName(gapVars[1])
    // secondary metrics for the gap chart (x axis)
    const gapMetrics = getSecondaryForDemographic(gapDem)
    // true if there is a secondary chart for the current gap
    const hasGapChart = isVersus && gapMetrics.length > 0

    return {
      data,
      dataExtents,
      allVars,
      scatterplotData,
      scatterplotVars,
      scatterplotExtents,
      isVersus,
      gapVars,
      gapMetrics,
      gapExtents,
      hasGapChart,
      mapVars,
      mapExtents,
      region,
      metric,
      demographic,
      // pad x and y extents for scatterplot
      extents: scatterplotExtents,
      // midpoints for x / y
      midpoints,
      // the diverging extent for colors for y values
      colorExtent: getColorRangeForVarName(
        mapVars[1],
        region,
        'map'
      )
    }
  }, [data, metric, region, demographic, secondary])
}
