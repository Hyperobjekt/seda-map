import useStaticData from '../../../data/useStaticData'
import logger from '../../../logger'
import { useMemo } from 'react'
import useDebounce from '../../../../shared/hooks/useDebounce'
import shallow from 'zustand/shallow'
import useFilters from './useFilters'
import useDataOptions from '../../hooks/useDataOptions'
import { applyFilters } from '../../../filters'

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
  const filters = useFilters()
  const [demographic, region] = useDataOptions(
    state => [state.demographic, state.region],
    shallow
  )

  // if schools, remove SES filter
  // if non-school region, remove FRL and school type filter
  const cleanFilters =
    region === 'schools'
      ? filters.filter(f => f[1] !== 'ses')
      : filters.filter(
          f => f[1] !== 'frl' && f[0] !== 'contains'
        )

  return useDebounce(
    useMemo(() => {
      const dataFilters = populateFilters(
        demographic,
        cleanFilters
      )
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
