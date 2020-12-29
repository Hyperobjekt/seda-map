import React from 'react'
import { MenuIcon } from '../../icons'
import { makeStyles, IconButton } from '@material-ui/core'
import useMenuVisibility from './useMenuVisibility'

const useStyles = makeStyles(theme => ({
  root: {
    borderColor: theme.palette.secondary.main,
    color: theme.palette.secondary.main
  }
}))

const SedaMenuButton = props => {
  const [, toggleMenu] = useMenuVisibility()
  const classes = useStyles()
  return (
    <IconButton
      className={classes.root}
      onClick={toggleMenu}
      {...props}>
      <MenuIcon />
    </IconButton>
  )
}

export default SedaMenuButton
