import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Checkbox from '@material-ui/core/Checkbox'
import Avatar from '@material-ui/core/Avatar'
import { getLang } from '../../../shared/selectors/lang'
import { ListSubheader } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  }
}))

export default function KeyMetricList({ metric, onMetricChange }) {
  const classes = useStyles()

  return (
    <List
      className={classes.root}
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Key Data Metrics
        </ListSubheader>
      }>
      {['avg', 'grd', 'coh'].map(value => {
        const labelId = `checkbox-list-secondary-label-${value}`
        return (
          <ListItem key={value} button onClick={() => onMetricChange(value)}>
            <ListItemAvatar>
              <Avatar
                alt={getLang('TAB_CONCEPT_' + value)}
                src={`/assets/img/${value}.svg`}
              />
            </ListItemAvatar>
            <ListItemText
              id={labelId}
              primary={getLang('TAB_CONCEPT_' + value)}
              secondary={getLang('TAB_METRIC_' + value)}
            />
            <ListItemSecondaryAction>
              <Checkbox
                edge="end"
                onChange={() => onMetricChange(value)}
                checked={metric === value}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        )
      })}
    </List>
  )
}
