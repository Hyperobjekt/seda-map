import useStaticData from '../../../data/useStaticData'
import logger from '../../../logger'
import { useMemo, useRef } from 'react'
import shallow from 'zustand/shallow'
import useDataOptions from '../../app/hooks/useDataOptions'
import { applyFilters } from '../../../filters'
import { getFiltersForDemographic } from '../selectors'
import useActiveFilters from './useActiveFilters'

/**
 * Returns data object with current filters applied
 */
export default function useFilteredData() {
  const data = useStaticData(state => state.data)
  const filteredRef = useRef([])
  const isLoading = useStaticData(state => state.isLoading)
  const filters = useActiveFilters()
  const [demographic, region] = useDataOptions(
    state => [state.demographic, state.region],
    shallow
  )
  const regionData = data[region]
  return useMemo(() => {
    // return reference to currently filtered data, if loading
    if (isLoading) return filteredRef.current
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
    filteredRef.current = filteredData
    logger.debug(`applied filters`, dataFilters, filteredData)
    return filteredData
  }, [isLoading, regionData, demographic, filters])
}
