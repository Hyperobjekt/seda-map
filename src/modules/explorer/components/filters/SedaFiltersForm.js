import React from 'react'
import PropTypes from 'prop-types'
import {
  useFilterStore,
  FilterList,
  FilterAdd
} from '../../../filters'
import logger from '../../../logger'

const SedaFiltersForm = props => {
  // grab filters array
  const filters = useFilterStore(state => state.filters)
  logger.debug('active filters', filters)
  const addFilter = useFilterStore(state => state.addFilter)
  const removeFilter = useFilterStore(
    state => state.removeFilter
  )
  const updateFilter = useFilterStore(
    state => state.updateFilter
  )
  const handleFilterRemove = filter => removeFilter(filter)
  const handleFilterChange = (change, e) => {
    logger.debug('filter change', change, e)
    updateFilter(
      change.ruleIndex,
      change.valueIndex,
      change.value
    )
  }
  const handleFilterAdd = filter => {
    logger.debug('add filter', filter)
    addFilter(filter)
  }
  return (
    <div {...props}>
      <h2>Filters</h2>
      <FilterList
        filters={filters}
        onFilterChange={handleFilterChange}
        onFilterRemove={handleFilterRemove}
      />
      <FilterAdd onFilterAdd={handleFilterAdd} />
    </div>
  )
}

SedaFiltersForm.propTypes = {}

export default SedaFiltersForm
