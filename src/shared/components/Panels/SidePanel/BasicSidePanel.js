import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  IconButton,
  withStyles
} from '@material-ui/core'
import {
  SidePanel,
  SidePanelHeader,
  SidePanelBody,
  SidePanelFooter
} from './index.js'
import { CloseIcon } from '../../../../modules/icons'

const styles = theme => ({
  root: {},
  title: theme.mixins.boldType,
  body: {
    padding: theme.spacing(1)
  },
  footer: {
    display: 'flex',
    justifyContent: 'stretch',
    alignItems: 'stretch',
    height: theme.spacing(6),
    '& .MuiButton-root': {
      flex: 1,
      '&:first-child': {
        borderRight: '1px solid',
        borderRightColor: theme.palette.divider
      }
    }
  }
})

/**
 * Generic selection panel wrapper
 */
const BasicSidePanel = ({
  title,
  footer,
  classes,
  children,
  onClose,
  ...props
}) => {
  const isTitleString = typeof title === 'string'
  const closeRef = useRef(null)
  // set focus to close button when the panel opens
  useEffect(() => {
    if (props.open && closeRef.current) closeRef.current.focus()
  }, [props.open])
  return (
    <SidePanel classes={{ root: classes.root }} {...props}>
      <SidePanelHeader sticky>
        {isTitleString && (
          <Typography className={classes.title}>
            {title}
          </Typography>
        )}
        {!isTitleString && title}
        <IconButton ref={closeRef} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </SidePanelHeader>
      <SidePanelBody classes={{ root: classes.body }}>
        {children}
      </SidePanelBody>
      {footer && (
        <SidePanelFooter className={classes.footer}>
          {footer}
        </SidePanelFooter>
      )}
    </SidePanel>
  )
}

BasicSidePanel.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func,
  children: PropTypes.any
}

export default withStyles(styles)(BasicSidePanel)
