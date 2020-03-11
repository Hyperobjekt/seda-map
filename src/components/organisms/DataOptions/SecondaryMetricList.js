import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import { getLang } from '../../../shared/selectors/lang'
import { ListSubheader } from '@material-ui/core'
import {
  DemographicAndGapMenu,
  RegionInlineMenu,
  HighlightedStateMenu
} from '../../seda/SedaSelectControls'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  }
}))

export default function SecondaryMetricList({
  demographic,
  region,
  highlightedState,
  onDemographicChange,
  onRegionChange,
  onHighlightedStateChange
}) {
  const classes = useStyles()

  return (
    <List
      className={classes.root}
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          More Data Options
        </ListSubheader>
      }>
      <ListItem>
        <ListItemText
          id="demographicLabel"
          primary={getLang('LABEL_DEMOGRAPHIC')}
        />
        <ListItemSecondaryAction>
          <DemographicAndGapMenu
            demographic={demographic}
            onChange={onDemographicChange}
          />
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem>
        <ListItemText id="regionLabel" primary={getLang('LABEL_REGION')} />
        <ListItemSecondaryAction>
          <RegionInlineMenu region={region} onChange={onRegionChange} />
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem>
        <ListItemText
          id="highlightedLabel"
          primary={getLang('LABEL_HIGHLIGHTED_STATE')}
        />
        <ListItemSecondaryAction>
          <HighlightedStateMenu
            highlightedState={highlightedState}
            onChange={onHighlightedStateChange}
          />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  )
}
