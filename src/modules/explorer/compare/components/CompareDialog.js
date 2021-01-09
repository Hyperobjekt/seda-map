import React, { useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import useCompareDialog from '../hooks/useCompareDialog'
import CompareTable from './CompareTable'
import CompareDemographicSelect from './CompareDemographicSelect'
import CompareSearch from './CompareSearch'
import CompareLoadSimilarButton from './CompareLoadSimilarButton'
import CompareExportButton from './CompareExportButton'
import {
  getLocationNameString,
  useActiveLocation,
  useAllLocationsData
} from '../../location'
import { useActiveOptions } from '../../app/hooks'
import shallow from 'zustand/shallow'
import useCompareStore from '../hooks/useCompareStore'
import { getLang, getPrefixLang } from '../../app/selectors/lang'
import { getRegionFromLocationId } from '../../app/selectors'

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

const DialogTitle = withStyles(styles)(props => {
  const { classes, title, subtitle, onClose, ...other } = props
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

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent)

function CompareDialog({ classes, ...props }) {
  // get required state
  const [open, setOpen] = useCompareDialog()
  const [activeLocation] = useActiveLocation()
  const locations = useAllLocationsData()
  const selectedLocation = locations.find(
    l => l.id === activeLocation
  )
  const [metric, demographic] = useActiveOptions()
  const setCompareStore = useCompareStore(
    state => state.setCompareStore
  )

  // pull required info from the app store into
  // the compare store when the dialog is open
  useEffect(() => {
    if (open) {
      setCompareStore({
        metric,
        demographic,
        locations,
        selectedLocation: activeLocation
      })
    }
  }, [open, metric, demographic, locations, activeLocation])

  // create dialog heading
  const region =
    activeLocation && getRegionFromLocationId(activeLocation)
  const dialogTitle = getLang('COMPARE_TITLE', {
    region: region ? getPrefixLang(region) : 'Locations'
  })
  // only show subtitle if there is active location
  const dialogSubtitle =
    activeLocation &&
    getLang('COMPARE_SUBTITLE', {
      location: getLocationNameString(selectedLocation)
    })

  // close button handler
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}>
      <DialogTitle
        id="customized-dialog-title"
        title={dialogTitle}
        subtitle={dialogSubtitle}
        onClose={handleClose}
      />
      <DialogContent dividers>
        <div className={classes.toolbar}>
          <CompareDemographicSelect />
          <CompareSearch />
          <CompareLoadSimilarButton />
          <CompareExportButton />
        </div>
        <CompareTable />
      </DialogContent>
    </Dialog>
  )
}

export default withStyles(styles)(CompareDialog)
