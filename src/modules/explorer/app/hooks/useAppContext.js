import { useMemo, useRef } from 'react'
import { useDataOptions } from '.'
import { useActiveFilters } from '../../filters'

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
import { useStaticData } from '../../../data'
import { applyFilters } from '../../../filters'
import { getFiltersForDemographic } from '../../filters/selectors'
import { MAX_DOTS } from '../../scatterplot/constants'

const getFilteredData = (filters, demographic, regionData) => {
  // update filters to apply to current demographic
  const dataFilters = getFiltersForDemographic(
    filters,
    demographic
  )
  // get the filtered dataset
  const filteredData = applyFilters(
    regionData || [],
    dataFilters
  )
  return filteredData
}

export default function useAppContext() {
  const appContext = useRef(null)
  const data = useStaticData(state => state.data)
  const filters = useActiveFilters()
  const isLoading = useStaticData(state => state.isLoading)
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
    // if loading, return the old app context
    if (isLoading && appContext.current) {
      return appContext.current
    }

    const regionData = data[region] || []
    const filteredData = getFilteredData(
      filters,
      demographic,
      regionData
    )
    // variable names for the scatterplot
    const [scatterplotVars, gapVars, mapVars] = [
      'chart',
      'gap',
      'map'
    ].map(type =>
      getVarNames(region, metric, secondary, demographic, type)
    )

    // get circles with valid values only, limit to MAX_DOTS
    const _scatterplotData =
      regionData &&
      regionData.filter(d =>
        scatterplotVars.every(v => hasVal(d[v]))
      )
    const scatterplotData = getFilteredData(
      filters,
      demographic,
      _scatterplotData
    )
      // sort by size
      .sort((a, b) => {
        return b[scatterplotVars[2]] - a[scatterplotVars[2]]
      })
      // limit number of dots
      .slice(0, MAX_DOTS)

    const allData = regionData
      ? regionData.filter(d =>
          scatterplotVars.every(v => hasVal(d[v]))
        )
      : []

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
    const allDataExtents = {}
    allVars.forEach(v => {
      // #516: do not adjust size extent based on filtered data
      dataExtents[v] =
        v.indexOf('_sz') > -1
          ? getDataExtent(regionData.slice(0, MAX_DOTS), v)
          : getDataExtent(scatterplotData, v)

      allDataExtents[v] =
        v.indexOf('_sz') > -1
          ? getDataExtent(regionData.slice(0, MAX_DOTS), v)
          : getDataExtent(allData, v)
    })

    // create padded extents for the scatterplot
    const scatterplotExtents = scatterplotVars.map(v => {
      const extent = allDataExtents[v]
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

    appContext.current = {
      allData: allData,
      data: filteredData,
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
      filters,
      filterResults: filteredData && filteredData.length,
      totalResults: regionData && regionData.length,
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
    return appContext.current
  }, [
    isLoading,
    data,
    metric,
    region,
    demographic,
    secondary,
    filters
  ])
}
