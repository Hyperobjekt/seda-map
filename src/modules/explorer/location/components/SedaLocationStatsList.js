import React from 'react'
import PropTypes from 'prop-types'
import { List, ListItem, ListItemText } from '@material-ui/core'
import { getPrefixLang } from '../../app/selectors/lang'

const SedaLocationStatsList = props => {
  const groups = [
    ['all'],
    ['a', 'b', 'h', 'i', 'w'],
    ['np', 'p'],
    ['m', 'f'],
    ['wb', 'wh', 'wi', 'pn', 'mf']
  ]
  return (
    <>
      {groups.map((subgroups, i) => (
        <List key={i}>
          {subgroups.map(subgroup => (
            <ListItem key={subgroup}>
              <ListItemText
                primary={getPrefixLang(subgroup, 'LABEL')}
              />
            </ListItem>
          ))}
        </List>
      ))}
    </>
  )
}

SedaLocationStatsList.propTypes = {}

export default SedaLocationStatsList
