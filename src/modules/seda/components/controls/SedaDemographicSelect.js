import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import useDataOptions from '../../hooks/useDataOptions'
import clsx from 'clsx'
import { ListSubheader } from '@material-ui/core'
import {
  getDemographics,
  getGaps,
  getDemographicLabel
} from '../../../../shared/selectors'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 4,
    paddingBottom: 4,
    width: '100%'
  },
  button: {
    textTransform: 'capitalize'
  },
  active: theme.mixins.activeListButton
}))

const SedaDemographicSelect = ({ onSelect, ...props }) => {
  const gaps = getGaps()
  const demographics = getDemographics()
  const demographic = useDataOptions(state => state.demographic)
  const classes = useStyles()
  const setDemographic = useDataOptions(
    state => state.setDemographic
  )
  const handleClick = demId => {
    if (demographic.id !== demId) {
      setDemographic(demId)
      onSelect && onSelect(demId)
    }
  }

  return (
    <>
      <List
        subheader={
          <ListSubheader disableSticky>Subgroups</ListSubheader>
        }
        aria-label="subgroup selection">
        {demographics.map((m, i) => {
          return (
            <ListItem
              className={clsx(classes.button, {
                [classes.active]: m.id === demographic.id
              })}
              button
              key={m.id}
              onClick={() => handleClick(m.id)}>
              <ListItemText
                primary={getDemographicLabel(
                  m.id,
                  'LABEL_STUDENTS'
                )}
              />
            </ListItem>
          )
        })}
      </List>
      <List
        subheader={
          <ListSubheader disableSticky>Gaps</ListSubheader>
        }
        aria-label="gap selection">
        {gaps.map((m, i) => {
          return (
            <ListItem
              className={clsx(classes.button, {
                [classes.active]: m.id === demographic.id
              })}
              button
              key={m.id}
              onClick={() => handleClick(m.id)}>
              <ListItemText
                primary={getDemographicLabel(m.id)}
              />
            </ListItem>
          )
        })}
      </List>
    </>
  )
}

SedaDemographicSelect.propTypes = {}

export default SedaDemographicSelect
