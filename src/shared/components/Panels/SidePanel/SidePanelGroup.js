import React from 'react'
import PropTypes from 'prop-types'
import { useTheme, withStyles } from '@material-ui/core'
import clsx from 'clsx'

const styles = theme => ({
  root: {
    position: 'relative',
    height: 'auto',
    zIndex: 2,
    minWidth: theme.app.panelWidth,
    pointerEvents: 'none',
    '& > *': {
      pointerEvents: 'all'
    },
    [theme.breakpoints.down('sm')]: {
      position: 'absolute',
      height: '100%',
      minWidth: '100%'
    }
  },
  condensed: {
    minWidth: theme.app.condensedPanelWidth
  }
})

/**
 * Goes through open panels in the children and sets a style
 * to position them.
 * @param {*} children
 * @param {*} maxVisible
 * @param {*} param3
 */
const setChildPositions = (
  children,
  { condensedWidth, stackOffset, condensed }
) => {
  let openPanels = 0
  let leftOffset = 0
  return React.Children.map(children, (child, i) => {
    // only set position if panel is open
    if (!child || !child.props.open) return child
    // get left offset
    const baseStyle = child.props.style || {}
    const style = {
      ...baseStyle,
      marginLeft: leftOffset
    }
    // set left offset to the condensed sidebar width
    leftOffset =
      (condensed ? condensedWidth : 0) + openPanels * stackOffset
    // increment open panels
    openPanels++
    return React.cloneElement(child, { style })
  })
}

const SidePanelGroup = ({
  children,
  classes,
  condensed,
  stackOffset = 0,
  className,
  ...props
}) => {
  const theme = useTheme()
  const updatedChildren = setChildPositions(children, {
    fullWidth: theme.app.panelWidth,
    condensedWidth: theme.app.condensedPanelWidth,
    stackOffset: stackOffset,
    condensed
  })
  return (
    <div
      className={clsx(
        'side-panel-group',
        classes.root,
        {
          [classes.condensed]: condensed
        },
        className
      )}
      {...props}>
      {updatedChildren}
    </div>
  )
}

SidePanelGroup.propTypes = {
  /** Maximum number of panels to show at once */
  maxVisible: PropTypes.number
}
SidePanelGroup.defaultProps = {
  maxVisible: 1
}

export default withStyles(styles)(SidePanelGroup)
