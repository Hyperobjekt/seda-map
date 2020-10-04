import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  root: {
    position: props => (props.sticky ? 'sticky' : 'relative'),
    bottom: 0,
    borderTop: `1px solid ${theme.palette.divider}`
  }
}))

const SidePanelFooter = forwardRef(function _SidePanelFooter(
  { sticky, children, className, classes: overrides, ...props },
  ref
) {
  const classes = useStyles()
  return (
    <div
      ref={ref}
      className={clsx(
        'panel__footer',
        classes.root,
        overrides.root,
        className
      )}
      {...props}>
      {children}
    </div>
  )
})

SidePanelFooter.propTypes = {
  /** true to fix to bottom of panel */
  sticky: PropTypes.bool,
  /** class name overrides for elements */
  classes: PropTypes.object
}
SidePanelFooter.defaultProps = {
  sticky: false,
  classes: {}
}

export default SidePanelFooter
