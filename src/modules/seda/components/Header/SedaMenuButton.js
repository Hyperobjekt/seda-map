import React from 'react'
import PropTypes from 'prop-types'
import { MenuIcon } from '../icons'
import { makeStyles, IconButton } from '@material-ui/core'
import useUiStore from '../../hooks/useUiStore'

const useStyles = makeStyles(theme => ({
  root: {
    borderColor: theme.palette.secondary.main,
    color: theme.palette.secondary.main
  }
}))

const SedaMenuButton = props => {
  const showMenu = useUiStore(state => state.showMenu)
  const toggleMenu = useUiStore(state => state.toggleMenu)
  const classes = useStyles()
  return (
    <IconButton className={classes.root} onClick={toggleMenu}>
      <MenuIcon />
    </IconButton>
  )
}

SedaMenuButton.propTypes = {}

export default SedaMenuButton
