import React from "react"
import PropTypes from "prop-types"
import { Paper, makeStyles } from "@material-ui/core"
import clsx from "clsx"

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "stretch",
    width: props =>
      props.condensed
        ? theme.app.condensedPanelWidth
        : theme.app.panelWidth,
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    height: "100%",
    transition: theme.transitions.create(
      ["margin", "transform"],
      {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }
    ),
    transform: "translateX(-100%)",
  },
  panelOpen: {
    transition: theme.transitions.create(
      ["margin", "transform"],
      {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }
    ),
    transform: "translateX(0)",
  },
}))

const SidePanel = ({
  open,
  classes: overrides,
  condensed,
  children,
  ...props
}) => {
  const classes = useStyles({ condensed })
  return (
    <Paper
      square
      classes={{
        root: clsx("panel", classes.root, overrides.root, {
          [classes.panelOpen]: open,
          "panel--open": open,
        }),
      }}
      {...props}
    >
      {children}
    </Paper>
  )
}

SidePanel.propTypes = {
  /** Determines if the panel is full width or condensed */
  condensed: PropTypes.bool,
}
SidePanel.defaultProps = {
  condensed: false,
  classes: {},
}

export default SidePanel
