import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  root: {
    position: props => (props.sticky ? 'sticky' : 'relative'),
    top: 0,
    padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    '& .MuiIconButton-root': {
      marginRight: theme.spacing(-1.5)
    }
  }
}))

const SidePanelHeader = ({
  sticky,
  children,
  classes: overrides,
  ...props
}) => {
  const classes = useStyles()
  return (
    <div
      className={clsx(
        'panel__header',
        classes.root,
        overrides.root
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
  classes: PropTypes.object
}
SidePanelHeader.defaultProps = {
  sticky: false,
  classes: {}
}

export default SidePanelHeader
