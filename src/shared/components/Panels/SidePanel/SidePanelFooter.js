import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import {  withStyles } from '@material-ui/core'
import clsx from 'clsx'

const styles = theme => ({
  root: {
    position: 'relative',
    bottom: 0,
    borderTop: `1px solid ${theme.palette.divider}`
  },
  sticky: {
    position: 'sticky'
  }
})

const SidePanelFooter = forwardRef(function _SidePanelFooter(
  { sticky, children, className, classes, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={clsx(
        'panel__footer',
        classes.root,
        {
          [classes.sticky]: sticky
        },
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

export default withStyles(styles)(SidePanelFooter)
