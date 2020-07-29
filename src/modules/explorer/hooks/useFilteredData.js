import useStaticData from '../../data/useStaticData'
import logger from '../../logger'
import useFilterStore, { applyFilters } from '../../filters'
import { useMemo } from 'react'

/**
 * Returns data object with current filters applied
 */
export default () => {
  const data = useStaticData(state => state.data)
  const filters = useFilterStore(state => state.filters)

  return useMemo(() => {
    return Object.keys(data).reduce((dataObj, key, i) => {
      dataObj[key] = applyFilters(data[key], filters)
      logger.debug('filtered data', dataObj)
      return dataObj
    }, {})
  }, [data, filters])
}
