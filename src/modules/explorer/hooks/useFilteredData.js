import useStaticData from '../../data/useStaticData'
import logger from '../../logger'
import useFilterStore, { applyFilters } from '../../filters'
import { useMemo } from 'react'
import useDebounce from '../../../shared/hooks/useDebounce'
import shallow from 'zustand/shallow'
import useDataOptions from './useDataOptions'

/**
 * Update the range and sort filters to use the
 * current demographic.
 */
const populateFilters = (demographic, filters) => {
  return filters.map(f => {
    if (f[0] !== 'range' && f[0] !== 'sort') return f
    return [f[0], demographic + '_' + f[1], f[2]]
  })
}

/**
 * Returns data object with current filters applied
 */
export default () => {
  const data = useStaticData(state => state.data)
  const filters = useFilterStore(state => state.filters)
  const [demographic, region] = useDataOptions(
    state => [state.demographic, state.region],
    shallow
  )

  return useDebounce(
    useMemo(() => {
      const dataFilters = populateFilters(demographic, filters)
      logger.debug(dataFilters, data)
      return applyFilters(data[region] || [], dataFilters)
    }, [data, region, filters, demographic]),
    500
  )
}
