import React from "react"
import PropTypes from "prop-types"
import clsx from "clsx"
import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  root: {
    width: "1em",
    height: "1em",
    fill: "currentColor",
  },
}))

const SplitIcon = ({ color, size = 16, ...props }) => {
  const classes = useStyles()
  return (
    <svg
      className={clsx("icon", classes.root)}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ fontSize: size }}
      {...props}
    >
      <path
        d="M1 3.5C1 3.22386 1.22386 3 1.5 3H6.5C6.77614 3 7 3.22386 7 3.5C7 3.77614 6.77614 4 6.5 4H1.5C1.22386 4 1 3.77614 1 3.5Z"
        fill={color}
      />
      <path
        d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V11C15 12.1046 14.1046 13 13 13H11C9.89543 13 9 12.1046 9 11V5Z"
        fill={color}
      />
      <path
        d="M1.5 6C1.22386 6 1 6.22386 1 6.5C1 6.77614 1.22386 7 1.5 7H6.5C6.77614 7 7 6.77614 7 6.5C7 6.22386 6.77614 6 6.5 6H1.5Z"
        fill={color}
      />
      <path
        d="M1 9.5C1 9.22386 1.22386 9 1.5 9H6.5C6.77614 9 7 9.22386 7 9.5C7 9.77614 6.77614 10 6.5 10H1.5C1.22386 10 1 9.77614 1 9.5Z"
        fill={color}
      />
      <path
        d="M1.5 12C1.22386 12 1 12.2239 1 12.5C1 12.7761 1.22386 13 1.5 13H6.5C6.77614 13 7 12.7761 7 12.5C7 12.2239 6.77614 12 6.5 12H1.5Z"
        fill={color}
      />
    </svg>
  )
}

SplitIcon.propTypes = {}

export default SplitIcon
