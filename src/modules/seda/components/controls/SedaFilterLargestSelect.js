import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Divider from '@material-ui/core/Divider'
import useDataOptions from '../../hooks/useDataOptions'
import clsx from 'clsx'
import { getRegions } from '../../../../shared/selectors'

/**
 * Get the size filter for region
 * @param {*} regionId
 */
const getSizesForRegion = regionId => {
  switch (regionId) {
    case 'counties':
      return [10, 50, 100, 500]
    case 'districts':
      return [10, 50, 100, 500, 1000]
    case 'schools':
      return [50, 100, 500, 1000, 5000]
    default:
      return []
  }
}

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
  const region = useDataOptions(state => state.region)
  const filters = useDataOptions(state => state.filters)
  const setFilter = useDataOptions(state => state.setFilter)
  const classes = useStyles()

  const handleClick = (largest, e) => {
    setFilter('largest', largest)
    onSelect && onSelect(largest, e)
  }

  return (
    <List
      classes={{ root: classes.root }}
      aria-label="filter largest selection">
      {getSizesForRegion(region.id).map((val, i) => {
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

SedaFilterLargestSelect.propTypes = {}

export default SedaFilterLargestSelect
