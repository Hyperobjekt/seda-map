import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import clsx from 'clsx'
import { useFilters, useRegionFilterSizes } from '../../hooks'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 4,
    paddingBottom: 4
  },
  button: {
    textTransform: 'capitalize'
  },
  active: theme.mixins.activeListButton
}))

const SedaFilterLargestSelect = ({ onSelect, ...props }) => {
  const regionSizes = useRegionFilterSizes()
  const [filters, , setFilter] = useFilters()
  const classes = useStyles()

  const handleClick = (largest, e) => {
    setFilter('largest', largest)
    onSelect && onSelect(largest, e)
  }

  return (
    <List
      classes={{ root: classes.root }}
      aria-label="filter largest selection">
      {regionSizes &&
        regionSizes.map((val, i) => {
          return (
            <ListItem
              className={clsx(classes.button, {
                [classes.active]: val === filters.largest
              })}
              button
              key={'item' + val}
              onClick={e => handleClick(val, e)}>
              <ListItemText primary={val + ' Largest'} />
            </ListItem>
          )
        })}
    </List>
  )
}

SedaFilterLargestSelect.propTypes = {
  onSelect: PropTypes.func
}

export default SedaFilterLargestSelect
