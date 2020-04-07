import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import clsx from 'clsx'
import { getRegions } from '../../../../shared/selectors'
import { useRegion } from '../../hooks'

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
  const [region, setRegion] = useRegion()
  const classes = useStyles()

  const regions = getRegions()

  const handleClick = regionId => {
    if (region !== regionId) {
      setRegion(regionId)
      onSelect && onSelect(regionId)
    }
  }

  return (
    <List
      classes={{ root: classes.root }}
      aria-label="region selection"
      {...props}>
      {regions.map((m, i) => {
        return (
          <ListItem
            className={clsx(classes.button, {
              [classes.active]: m.id === region
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

SedaRegionSelect.propTypes = {
  onSelect: PropTypes.func
}

export default SedaRegionSelect
