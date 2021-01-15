import React, { useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogContent from '@material-ui/core/DialogContent'
import useCompareDialog from '../hooks/useCompareDialog'
import CompareTable from './CompareTable'
import CompareDemographicSelect from './CompareDemographicSelect'
import CompareSearch from './CompareSearch'
import CompareLoadSimilarButton from './CompareLoadSimilarButton'
import CompareExportButton from './CompareExportButton'
import { useActiveLocation, useLocations } from '../../location'
import { useActiveOptions } from '../../app/hooks'
import useCompareStore from '../hooks/useCompareStore'
import CompareDialogTitle from './CompareDialogTitle'

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  toolbar: {
    display: 'flex',
    marginBottom: theme.spacing(2),
    '& > * + *': {
      marginLeft: theme.spacing(1)
    }
  }
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
  const [locations] = useLocations()
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
  }, [
    open,
    metric,
    demographic,
    locations,
    activeLocation,
    setCompareStore
  ])

  // close button handler
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog
    maxWidth={false}
      onClose={handleClose}
      aria-labelledby="compare-dialog-title"
      open={open}>
      <CompareDialogTitle
        id="compare-dialog-title"
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
