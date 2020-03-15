import React from 'react'
import PropTypes from 'prop-types'
import {
  ListItemIcon,
  makeStyles,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@material-ui/core'
import PlaceIcon from '@material-ui/icons/Place'
import MetricIcon from '../Icons/MetricIcon'
import LayersIcon from '@material-ui/icons/Layers'
import FilterIcon from '../Icons/FilterIcon'
import PeopleIcon from '@material-ui/icons/PeopleAlt'
import ChevronRight from '@material-ui/icons/ChevronRight'
import { getSelectionLabel } from '../../../../shared/selectors/lang'
import clsx from 'clsx'
import useUiStore from '../../hooks/useUiStore'
import useDataOptions from '../../hooks/useDataOptions'

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: theme.spacing(9)
  },
  icon: {
    color: theme.palette.common.black,
    '& svg': { fontSize: 32 }
  },
  secondary: {
    textTransform: 'capitalize'
  }
}))

const SelectionIcon = ({ selectionId }) => {
  const metric = useDataOptions(state => state.metric)
  switch (selectionId) {
    case 'metric':
      return <MetricIcon metricId={metric.id} />
    case 'demographic':
      return <PeopleIcon />
    case 'region':
      return <LayersIcon />
    case 'filter':
      return <FilterIcon />
    case 'location':
      return <PlaceIcon />
    default:
      return null
  }
}

const SedaSelectionButton = ({
  selectionId,
  value,
  ...props
}) => {
  const classes = useStyles()
  const label = getSelectionLabel(selectionId)
  const selection = useUiStore(state => state.selection)
  const setSelection = useUiStore(state => state.setSelection)
  return (
    <ListItem
      classes={{ root: clsx(classes.root) }}
      button
      onClick={() => setSelection(selectionId)}
      {...props}>
      <ListItemIcon classes={{ root: classes.icon }}>
        <SelectionIcon selectionId={selectionId} />
      </ListItemIcon>
      <ListItemText
        primary={label}
        secondary={value}
        classes={{ secondary: classes.secondary }}
      />
      <ListItemSecondaryAction>
        <ChevronRight />
      </ListItemSecondaryAction>
    </ListItem>
  )
}

SedaSelectionButton.propTypes = {}

export default SedaSelectionButton
