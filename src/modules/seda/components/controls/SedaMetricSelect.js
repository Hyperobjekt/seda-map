import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import { MetricIcon } from '../../../icons'
import useDataOptions from '../../hooks/useDataOptions'
import clsx from 'clsx'
import {
  getKeyMetrics,
  getMetricLabel
} from '../../../../shared/selectors'
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
    },
    '& .MuiListItemSecondaryAction-root': {
      fontSize: theme.spacing(3)
    }
  },
  active: theme.mixins.activeListButton,
  secondaryAction: {
    pointerEvents: 'none',
    fontSize: 24,
    right: theme.spacing(3)
  }
}))

const SedaMetricSelect = ({ onSelect }) => {
  const theme = useTheme()
  const metrics = getKeyMetrics().map(m =>
    Object.assign(m, {
      description: getMetricLabel(m.id, 'LABEL_REFLECTS')
    })
  )
  const metric = useDataOptions(state => state.metric)
  const classes = useStyles()
  const setMetric = useDataOptions(state => state.setMetric)
  const handleClick = metricId => {
    if (metric.id !== metricId) {
      setMetric(metricId)
      onSelect && onSelect(metricId)
    }
  }

  return (
    <List
      classes={{ root: classes.root }}
      aria-label="educational opportunity metric">
      {metrics.map((m, i) => {
        return (
          <ListItem
            className={clsx(classes.button, {
              [classes.active]: m.id === metric.id
            })}
            button
            key={m.id}
            onClick={() => handleClick(m.id)}>
            <ListItemText
              primary={m.label}
              secondary={m.description}
            />
            <ListItemSecondaryAction
              className={classes.secondaryAction}>
              <MetricIcon
                style={{
                  color:
                    m.id === metric.id
                      ? theme.palette.primary.main
                      : theme.palette.grey[500]
                }}
                metricId={m.id}
              />
            </ListItemSecondaryAction>
          </ListItem>
        )
      })}
    </List>
  )
}

SedaMetricSelect.propTypes = {}

export default SedaMetricSelect
