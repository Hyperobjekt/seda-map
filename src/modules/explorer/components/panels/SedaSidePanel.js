import React from 'react'
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
} from '../../../../shared/components/Panels/SidePanel'
import { CloseIcon } from '../../../icons'
import { useCondensed, useHelpVisibility } from '../../hooks'

const useStyles = makeStyles(theme => ({
  root: {},
  title: theme.mixins.boldType,
  body: {
    padding: theme.spacing(1),
    '& > .MuiList-root .MuiButtonBase-root': {
      paddingLeft: 44
    }
  }
}))

/**
 * Generic selection panel wrapper
 */
const SedaSidePanel = ({
  title,
  children,
  onClose,
  ...props
}) => {
  const [condensed] = useCondensed()
  const [showHelp] = useHelpVisibility()
  const classes = useStyles({ condensed, showHelp })

  return (
    <SidePanel classes={{ root: classes.root }} {...props}>
      <SidePanelHeader sticky>
        <Typography className={classes.title}>
          {title}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </SidePanelHeader>
      <SidePanelBody classes={{ root: classes.body }}>
        {children}
      </SidePanelBody>
    </SidePanel>
  )
}

SedaSidePanel.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func,
  children: PropTypes.any
}

export default SedaSidePanel
