import useStaticData from '../../../data/useStaticData'
import logger from '../../../logger'
import { useMemo } from 'react'
import useDebounce from '../../../../shared/hooks/useDebounce'
import shallow from 'zustand/shallow'
import useFilters from './useFilters'
import useDataOptions from '../../app/hooks/useDataOptions'
import { applyFilters } from '../../../filters'
import {
  getFiltersForDemographic,
  removeIrrelevantFilters
} from '../selectors'

/**
 * Returns data object with current filters applied
 */
export default () => {
  const data = useStaticData(state => state.data)
  const filters = useFilters()
  const [demographic, region] = useDataOptions(
    state => [state.demographic, state.region],
    shallow
  )
  return useDebounce(
    useMemo(() => {
      // drop filters that do not apply to current region
      const cleanFilters = removeIrrelevantFilters(
        filters,
        region
      )
      // update filters to apply to current demographic
      const dataFilters = getFiltersForDemographic(
        cleanFilters,
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
