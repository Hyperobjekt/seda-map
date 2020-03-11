import React from "react"
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/core"
import clsx from "clsx"

const useStyles = makeStyles(theme => ({
  root: {
    position: props => (props.sticky ? "sticky" : "relative"),
    bottom: 0,
    borderTop: `1px solid ${theme.palette.divider}`,
  },
}))

const SidePanelFooter = ({
  sticky,
  children,
  classes: overrides,
  ...props
}) => {
  const classes = useStyles()
  return (
    <div
      className={clsx(
        "panel__footer",
        classes.root,
        overrides.root
      )}
    >
      {children}
    </div>
  )
}

SidePanelFooter.propTypes = {
  /** true to fix to bottom of panel */
  sticky: PropTypes.bool,
  /** class name overrides for elements */
  classes: PropTypes.object,
}
SidePanelFooter.defaultProps = {
  sticky: false,
  classes: {},
}

export default SidePanelFooter
