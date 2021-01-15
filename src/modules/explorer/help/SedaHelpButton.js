import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, Button } from '@material-ui/core'
import clsx from 'clsx'
import useHelpVisibility from './useHelpVisibility'

const useStyles = makeStyles(theme => ({
  root: {
    borderColor: theme.palette.secondary.main,
    color: theme.palette.secondary.main,
    [theme.breakpoints.down('sm')]: {
      height: "28px",
    }
  }
}))

const SedaHelpButton = ({
  classes: overrides = {},
  ...props
}) => {
  const classes = useStyles()
  const [, toggleHelp] = useHelpVisibility()
  return (
    <Button
      variant="outlined"
      className={clsx(classes.root, overrides.root)}
      onClick={toggleHelp}
      {...props}>
      Help
    </Button>
  )
}

SedaHelpButton.propTypes = {
  classes: PropTypes.object
}

export default SedaHelpButton
