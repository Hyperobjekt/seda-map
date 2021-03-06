import React from 'react'
import useFilterStore from './useFilterStore'
import FilterAdd from './FilterAdd'
import FilterList from './FilterList'

/**
 * Note: Used for the experimental data view, NOT USED IN THE EXPLORER!
 */
const FiltersForm = props => {
  const filters = useFilterStore(state => state.filters)
  const addFilter = useFilterStore(state => state.addFilter)
  const removeFilter = useFilterStore(
    state => state.removeFilter
  )

  const handleFilterRemove = filter => removeFilter(filter)
  const handleFilterChange = (change, e) => {
    console.log('TODO: implement with setFilter', change, e)
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
