import React from "react"
import PropTypes from "prop-types"
import { makeStyles, Button } from "@material-ui/core"
import useUiStore from "../../hooks/useUiStore"
import clsx from "clsx"

const useStyles = makeStyles(theme => ({
  root: {
    borderColor: theme.palette.secondary.main,
    color: theme.palette.secondary.main,
  },
}))

const SedaHelpButton = ({
  classes: overrides = {},
  ...props
}) => {
  const classes = useStyles()
  const showHelp = useUiStore(state => state.showHelp)
  const toggleHelp = useUiStore(state => state.toggleHelp)
  return (
    <Button
      variant="outlined"
      className={clsx(classes.root, overrides.root)}
      onClick={toggleHelp}
      {...props}
    >
      Help
    </Button>
  )
}

SedaHelpButton.propTypes = {}

export default SedaHelpButton
