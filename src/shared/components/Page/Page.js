import React from "react"
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/core"
import clsx from "clsx"

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    minHeight: "100vh",
    width: "100%",
  },
}))

const Page = ({ children, classes: overrides, ...props }) => {
  const classes = useStyles(props)
  return (
    <div
      className={clsx("page", classes.root, overrides.root)}
      {...props}
    >
      {children}
    </div>
  )
}

Page.propTypes = {
  classes: PropTypes.object,
}
Page.defaultProps = {
  classes: {},
}

export default Page
