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

const SedaRegionSelect = ({ onSelect, ...props }) => {
  const regions = getRegions()
  const region = useDataOptions(state => state.region)
  const classes = useStyles()
  const setRegion = useDataOptions(state => state.setRegion)
  const handleClick = regionId => {
    if (region.id !== regionId) {
      setRegion(regionId)
      onSelect && onSelect(regionId)
    }
  }

  return (
    <List
      classes={{ root: classes.root }}
      aria-label="region selection">
      {regions.map((m, i) => {
        return (
          <ListItem
            className={clsx(classes.button, {
              [classes.active]: m.id === region.id
            })}
            button
            key={m.id}
            onClick={() => handleClick(m.id)}>
            <ListItemText primary={m.label} />
          </ListItem>
        )
      })}
    </List>
  )
}

SedaRegionSelect.propTypes = {}

export default SedaRegionSelect
