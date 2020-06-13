import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import clsx from 'clsx'
import { getAllStates } from '../../../../shared/utils/states'
import { useFilters } from '../../hooks'

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
  const [filters, , setFilter] = useFilters()
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

SedaFilterStateSelect.propTypes = {
  onSelect: PropTypes.func
}

export default SedaFilterStateSelect
