import React from 'react'
import PropTypes from 'prop-types'
import {
  ListItemIcon,
  makeStyles,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@material-ui/core'
import {
  MetricIcon,
  FilterIcon,
  RegionsIcon,
  SubgroupsIcon,
  LocationsIcon
} from '../icons'
import ChevronRight from '@material-ui/icons/ChevronRight'
import { getSelectionLabel } from '../../../../shared/selectors/lang'
import clsx from 'clsx'
import useUiStore from '../../hooks/useUiStore'
import useDataOptions from '../../hooks/useDataOptions'

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: theme.spacing(9),
    paddingLeft: theme.spacing(3)
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
      return <SubgroupsIcon />
    case 'region':
      return <RegionsIcon />
    case 'filter':
      return <FilterIcon />
    case 'location':
      return <LocationsIcon />
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
