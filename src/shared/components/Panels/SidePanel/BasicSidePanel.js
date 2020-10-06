import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  makeStyles,
  IconButton
} from '@material-ui/core'
import {
  SidePanel,
  SidePanelHeader,
  SidePanelBody
} from './index.js'
import { CloseIcon } from '../../../../modules/icons'

const useStyles = makeStyles(theme => ({
  root: {},
  title: theme.mixins.boldType,
  body: {
    padding: theme.spacing(1)
  }
}))

/**
 * Generic selection panel wrapper
 */
const BasicSidePanel = ({
  title,
  children,
  onClose,
  ...props
}) => {
  const classes = useStyles()
  const closeRef = useRef(null)
  // set focus to close button when the panel opens
  useEffect(() => {
    if (props.open && closeRef.current) closeRef.current.focus()
  }, [props.open])
  return (
    <SidePanel classes={{ root: classes.root }} {...props}>
      <SidePanelHeader sticky>
        <Typography className={classes.title}>
          {title}
        </Typography>
        <IconButton ref={closeRef} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </SidePanelHeader>
      <SidePanelBody classes={{ root: classes.body }}>
        {children}
      </SidePanelBody>
    </SidePanel>
  )
}

BasicSidePanel.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func,
  children: PropTypes.any
}

export default BasicSidePanel
