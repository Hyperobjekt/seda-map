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
import { getAllStates } from '../../../../shared/selectors/states'

const statesList = getAllStates()

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

const SedaFilterStateSelect = ({ onSelect, ...props }) => {
  const filters = useDataOptions(state => state.filters)
  const setFilter = useDataOptions(state => state.setFilter)
  const classes = useStyles()

  const handleClick = (stateId, e) => {
    setFilter('prefix', stateId)
    onSelect && onSelect(stateId, e)
  }

  return (
    <List aria-label="list of U.S. states">
      {statesList.map((state, i) => {
        return (
          <ListItem
            className={clsx(classes.button, {
              [classes.active]: state.id === filters.prefix
            })}
            button
            key={state.abbr}
            onClick={e => handleClick(state.id, e)}>
            <ListItemText primary={state.full} />
          </ListItem>
        )
      })}
    </List>
  )
}

SedaFilterStateSelect.propTypes = {}

export default SedaFilterStateSelect
