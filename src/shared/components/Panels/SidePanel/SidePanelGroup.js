import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    zIndex: 2,
    minWidth: props =>
      props.condensed
        ? theme.app.condensedPanelWidth
        : theme.app.panelWidth
  }
}))

/**
 * Returns number of children panels that are open
 * @param {*} children
 */
const getOpenPanelCount = children =>
  React.Children.toArray(children)
    .map(child => child.props.open)
    .filter(c => c).length

/**
 * Goes through open panels in the children and sets a style
 * to position them.
 * @param {*} children
 * @param {*} maxVisible
 * @param {*} param3
 */
const setChildPositions = (
  children,
  maxVisible,
  { fullWidth, condensedWidth }
) => {
  let openPanels = 0
  let leftOffset = 0
  return React.Children.map(children, (child, i) => {
    // only set panel positions
    // if (child.type.name !== "Panel") return child
    // only set position if panel is open
    if (!child || !child.props.open) return child
    // get left offset
    const baseStyle = child.props.style || {}
    const style = {
      ...baseStyle,
      marginLeft: leftOffset
    }
    const w = child.props.condensed ? condensedWidth : fullWidth
    leftOffset =
      maxVisible > openPanels ? leftOffset + w : leftOffset
    if (!child.props.condensed) openPanels++
    return React.cloneElement(child, { style })
  })
}

const SidePanelGroup = ({ children, maxVisible, condensed }) => {
  const theme = useTheme()
  const updatedChildren = setChildPositions(
    children,
    maxVisible,
    {
      fullWidth: theme.app.panelWidth,
      condensedWidth: theme.app.condensedPanelWidth - 16
    }
  )
  const openPanelCount = getOpenPanelCount(children)

  const classes = useStyles({
    panelCount: Math.min(openPanelCount, maxVisible),
    condensed
  })
  return <div className={classes.root}>{updatedChildren}</div>
}

SidePanelGroup.propTypes = {
  /** Maximum number of panels to show at once */
  maxVisible: PropTypes.number
}
SidePanelGroup.defaultProps = {
  maxVisible: 1
}

export default SidePanelGroup
