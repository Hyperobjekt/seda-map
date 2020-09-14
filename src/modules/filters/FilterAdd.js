import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Field from './Field'
import FilterFields from './FilterFields'
import {
  filterRuleFields as defaultRuleFields,
  defaultValues as defaultRuleValues
} from './constants'
import { makeStyles, Button } from '@material-ui/core'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  filterSelect: {
    minWidth: theme.spacing(13),
    marginRight: theme.spacing(1)
  }
}))

/**
 * Provides inputs for adding a filter rule, including:
 *
 *   - Filter Type (select)
 *   - Filter Fields (based on filter type, defined in constants)
 *   - Add button
 *
 */
const FilterAdd = ({
  defaultValues,
  filterRuleFields,
  onFilterAdd,
  className,
  classes: overrides,
  ...props
}) => {
  const classes = useStyles()
  const [filterType, setFilterType] = useState('startsWith')
  const [filterValues, setFilterValues] = useState(
    defaultValues['startsWith']
  )
  const filterOptions = Object.keys(filterRuleFields)
  const handleTypeChange = e => {
    setFilterType(e.target.value)
    setFilterValues(defaultValues[e.target.value])
  }
  const handleValueChange = (field, valueIndex, e) => {
    const value = e.target.value
    const newValues = filterValues.map((fv, i) => {
      if (i !== valueIndex) return fv
      return value
    })
    setFilterValues(newValues)
  }
  const handleAddFilter = () => {
    onFilterAdd && onFilterAdd([filterType, ...filterValues])
  }
  return (
    <div
      className={clsx(classes.root, overrides.root, className)}
      {...props}>
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
  classes: {},
  defaultValues: defaultRuleValues,
  filterRuleFields: defaultRuleFields
}

FilterAdd.propTypes = {
  /** Handler for adding filter */
  onFilterAdd: PropTypes.func,
  /** Class name for root element */
  className: PropTypes.string,
  /** Object of classNames for component elements */
  classes: PropTypes.object,
  /** Default values for filter rules */
  defaultValues: PropTypes.object,
  /** Input definitions for available filter rules */
  filterRuleFields: PropTypes.object
}

export default FilterAdd
