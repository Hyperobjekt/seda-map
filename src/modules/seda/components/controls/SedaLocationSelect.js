import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import MetricIcon from '../Icons/MetricIcon'
import useDataOptions from '../../hooks/useDataOptions'
import clsx from 'clsx'
import { getKeyMetrics } from '../../../../shared/selectors'
import { getMetricDescription } from '../../../../shared/selectors/lang'
import SearchInput from '../../../../base/components/SearchInput'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 4,
    paddingBottom: 4
  },
  button: {
    textTransform: 'capitalize',
    borderRadius: theme.shape.borderRadius,
    '& .MuiListItemText-secondary': {
      fontSize: theme.typography.pxToRem(12)
    }
  },
  active: theme.mixins.activeListButton
}))

const SedaLocationSelect = ({ onSelect }) => {
  const theme = useTheme()
  const classes = useStyles()

  const locations = useDataOptions(state => state.locations)

  return (
    <div style={{ padding: '4px 0', width: '100%' }}>
      <SearchInput placeholder="Find a county, district, or school" />
      {locations && locations.length ? (
        <List
          classes={{ root: classes.root }}
          aria-label="selected locations">
          {locations.map((l, i) => {
            return (
              <ListItem button key={l.id}>
                <ListItemText primary={l.properties.name} />
              </ListItem>
            )
          })}
        </List>
      ) : (
        <Typography
          style={{ display: 'block', padding: 16 }}
          variant="caption">
          You have not selected any locations. Use the location
          search above or select locations in the map or chart
          view.
        </Typography>
      )}
    </div>
  )
}

SedaLocationSelect.propTypes = {}

export default SedaLocationSelect
