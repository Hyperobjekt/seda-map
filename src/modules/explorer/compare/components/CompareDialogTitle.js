import React from 'react'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import {
  IconButton,
  Typography,
  withStyles
} from '@material-ui/core'
import { getLang, getPrefixLang } from '../../app/selectors/lang'
import {
  getLocationNameString,
  useLocationData
} from '../../location'
import useCompareStore from '../hooks/useCompareStore'
import { CloseIcon } from '../../../icons'
import { useRegion } from '../../app/hooks'

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  toolbar: {
    display: 'flex'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
})

export default withStyles(styles)(props => {
  const { classes, onClose, ...other } = props

  const selectedLocation = useCompareStore(
    state => state.selectedLocation
  )

  const [region] = useRegion()

  // create dialog heading
  const title = getLang('COMPARE_TITLE', {
    region: region ? getPrefixLang(region) : 'Locations'
  })

  const locationData = useLocationData(selectedLocation)

  // only show subtitle if there is active location
  const subtitle =
    selectedLocation &&
    getLang('COMPARE_SUBTITLE', {
      location: getLocationNameString(locationData)
    })

  return (
    <MuiDialogTitle
      disableTypography
      className={classes.root}
      {...other}>
      <div>
        <Typography variant="h6">{title}</Typography>
        {subtitle && (
          <Typography variant="body2">{subtitle}</Typography>
        )}
      </div>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
})
