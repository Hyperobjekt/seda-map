import React, { useState } from 'react'
import PropTypes from 'prop-types'
import useFilterStore from './useFilterStore'
import FilterAdd from './FilterAdd'
import FilterList from './FilterList'

const FiltersForm = props => {
  const filters = useFilterStore(state => state.filters)
  const addFilter = useFilterStore(state => state.addFilter)
  const removeFilter = useFilterStore(
    state => state.removeFilter
  )
  const updateFilterByIndex = useFilterStore(
    state => state.updateFilterByIndex
  )
  const handleFilterRemove = filter => removeFilter(filter)
  const handleFilterChange = (change, e) => {
    updateFilterByIndex(
      change.ruleIndex,
      change.valueIndex,
      change.value
    )
  }
  const handleFilterAdd = filter => {
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

FiltersForm.propTypes = {}

export default FiltersForm
