import React from 'react'
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  makeStyles
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

import { filterRuleFields } from './constants'
import FilterFields from './FilterFields'
import clsx from 'clsx'

const useListItemStyles = makeStyles(theme => ({
  root: {
    justifyContent: 'stretch'
  },
  text: {
    minWidth: theme.spacing(12),
    flex: 0
  },
  filterFields: {
    flex: 1
  }
}))

const FilterListItem = ({
  filter,
  onRemove,
  className,
  classes: overrides,
  onChange,
  ...props
}) => {
  const classes = useListItemStyles()
  const [filterType, ...values] = filter
  const handleChange = (field, idx, e) => {
    onChange &&
      onChange({ valueIndex: idx, value: e.target.value }, e)
  }
  return (
    <ListItem
      className={clsx(
        'filter-list-item',
        classes.root,
        overrides.root,
        className
      )}
      {...props}>
      <ListItemText
        className={clsx(classes.text, overrides.text)}
        primary={filterType}
      />
      <FilterFields
        id={filterType}
        fields={filterRuleFields[filterType]}
        values={values}
        onChange={handleChange}
        className={clsx(
          classes.filterFields,
          overrides.filterFields
        )}
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={e => onRemove(filter, e)}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

FilterListItem.defaultProps = {
  classes: {}
}

const FilterList = ({
  filters,
  onFilterRemove,
  onFilterChange,
  ...props
}) => {
  const handleFilterChange = (change, e) => {
    onFilterChange && onFilterChange(change, e)
  }
  return (
    <List>
      {filters.map((f, i) => (
        <FilterListItem
          key={f[0]}
          filter={f}
          onChange={(change, e) =>
            handleFilterChange({ ruleIndex: i, ...change }, e)
          }
          onRemove={onFilterRemove}
        />
      ))}
    </List>
  )
}

export default FilterList
