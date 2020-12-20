import useStaticData from '../../../data/useStaticData'
import logger from '../../../logger'
import { useMemo } from 'react'
import useDebounce from '../../../../shared/hooks/useDebounce'
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
  const filters = useActiveFilters()
  const [demographic, region] = useDataOptions(
    state => [state.demographic, state.region],
    shallow
  )
  return useDebounce(
    useMemo(() => {
      // update filters to apply to current demographic
      const dataFilters = getFiltersForDemographic(
        filters,
        demographic
      )
      // get the filtered dataset
      const filteredData = applyFilters(
        data[region] || [],
        dataFilters
      )
      logger.debug(`applied filters`, dataFilters, filteredData)
      return filteredData
    }, [data, region, filters, demographic]),
    500
  )
}
