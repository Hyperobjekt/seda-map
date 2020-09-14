import React from "react"
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/core"
import clsx from "clsx"

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    overflowY: "scroll",
    overflowX: "hidden",
  },
}))

const SidePanelBody = ({
  children,
  classes: overrides,
  ...props
}) => {
  const classes = useStyles()
  return (
    <div className={clsx(classes.root, overrides.root)}>
      {children}
    </div>
  )
}

SidePanelBody.propTypes = {
  /** class name overrides for elements */
  classes: PropTypes.object,
}
SidePanelBody.defaultProps = {
  classes: {},
}

export default SidePanelBody
