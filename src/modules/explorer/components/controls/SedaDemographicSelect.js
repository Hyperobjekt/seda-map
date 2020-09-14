import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import clsx from 'clsx'
import { ListSubheader } from '@material-ui/core'
import {
  getDemographics,
  getGaps,
  getDemographicLabel
} from '../../selectors'
import { useDemographic } from '../../hooks'
import { SidePanelList } from '../../../../shared'

const SedaDemographicSelect = ({ onSelect, ...props }) => {
  const gaps = getGaps()
  const demographics = getDemographics()
  const [demographic, setDemographic] = useDemographic()
  const handleClick = demId => {
    if (demographic !== demId) {
      setDemographic(demId)
      onSelect && onSelect(demId)
    }
  }

  return (
    <>
      <SidePanelList
        subheader={
          <ListSubheader disableSticky>Subgroups</ListSubheader>
        }
        aria-label="subgroup selection">
        {demographics.map((m, i) => {
          return (
            <ListItem
              className={clsx({
                'MuiListItem--active': m.id === demographic
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
      </SidePanelList>
      <SidePanelList
        subheader={
          <ListSubheader disableSticky>Gaps</ListSubheader>
        }
        aria-label="gap selection">
        {gaps.map((m, i) => {
          return (
            <ListItem
              className={clsx({
                'MuiListItem--active': m.id === demographic
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
      </SidePanelList>
    </>
  )
}

SedaDemographicSelect.propTypes = {
  onSelect: PropTypes.func
}

export default SedaDemographicSelect
