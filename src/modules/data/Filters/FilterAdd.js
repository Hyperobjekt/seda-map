import React, { useState } from 'react'
import Field from './Field'
import FilterFields from './FilterFields'
import { filterRuleFields, defaultValues } from './constants'
import { makeStyles, Button } from '@material-ui/core'
import clsx from 'clsx'

const filterOptions = Object.keys(filterRuleFields)

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  filterSelect: {
    minWidth: theme.spacing(13),
    marginRight: theme.spacing(1)
  }
}))

const FilterAdd = ({
  onFilterAdd,
  className,
  classes: overrides,
  ...props
}) => {
  const [filterType, setFilterType] = useState('startsWith')
  const [filterValues, setFilterValues] = useState(
    defaultValues['startsWith']
  )
  const classes = useStyles()
  const handleTypeChange = e => {
    console.log('filter type change', e)
    setFilterType(e.target.value)
    setFilterValues(defaultValues[e.target.value])
  }
  const handleValueChange = (field, valueIndex, e) => {
    const value = e.target.value
    const newValues = filterValues.map((fv, i) => {
      if (i !== valueIndex) return fv
      return value
    })
    console.log('value cahnge', filterValues, newValues)
    setFilterValues(newValues)
  }
  const handleAddFilter = () => {
    console.log('add filter', filterType, filterValues)
    onFilterAdd && onFilterAdd([filterType, ...filterValues])
  }
  return (
    <div
      className={clsx(classes.root, overrides.root, className)}>
      <Field
        className={clsx(
          classes.filterSelect,
          overrides.filterSelect
        )}
        label="Filter Type"
        widget="select"
        options={filterOptions}
        value={filterType}
        onChange={handleTypeChange}
      />
      {filterRuleFields[filterType] && (
        <FilterFields
          id={filterType}
          fields={filterRuleFields[filterType]}
          values={filterValues}
          onChange={handleValueChange}
        />
      )}
      <Button onClick={handleAddFilter}>Add</Button>
    </div>
  )
}

FilterAdd.defaultProps = {
  classes: {}
}

export default FilterAdd
