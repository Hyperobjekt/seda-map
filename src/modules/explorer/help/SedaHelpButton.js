import React from 'react'
import PropTypes from 'prop-types'
import { withStyles, Button } from '@material-ui/core'
import clsx from 'clsx'
import useHelpVisibility from './useHelpVisibility'

const styles = theme => ({
  root: {
    borderColor: theme.palette.secondary.main,
    color: theme.palette.secondary.main
  }
})

const SedaHelpButton = ({ classes, className, ...props }) => {
  const [, toggleHelp] = useHelpVisibility()
  return (
    <Button
      variant="outlined"
      className={clsx('button--help', classes.root, className)}
      onClick={toggleHelp}
      {...props}>
      Help
    </Button>
  )
}

SedaHelpButton.propTypes = {
  classes: PropTypes.object
}

export default withStyles(styles)(SedaHelpButton)
