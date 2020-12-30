import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { withStyles } from '@material-ui/core'

const styles = theme => ({
  root: {
    position: 'relative',
    top: 0,
    padding: theme.spacing(1, 3),
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: theme.spacing(7),
    '& .MuiIconButton-root': {
      marginRight: theme.spacing(-1.5),
      padding: 8
    }
  },
  sticky: {
    position: 'sticky'
  }
})

const SidePanelHeader = ({
  sticky,
  children,
  className,
  classes,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'panel__header',
        classes.root,
        { [classes.sticky]: sticky },
        className
      )}
      {...props}>
      {children}
    </div>
  )
}

SidePanelHeader.propTypes = {
  /** true to stick to top on scroll */
  sticky: PropTypes.bool,
  /** class name overrides for elements */
  classes: PropTypes.object,
  /** class name for root */
  className: PropTypes.string
}
SidePanelHeader.defaultProps = {
  sticky: false,
  classes: {}
}

export default withStyles(styles)(SidePanelHeader)
