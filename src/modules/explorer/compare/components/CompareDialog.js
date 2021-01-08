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
  useActiveLocation,
  useAllLocationsData
} from '../../location'
import { useActiveOptions } from '../../app/hooks'

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
        <Typography variant="body2">{subtitle}</Typography>
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
  const [open, setOpen] = useCompareDialog()

  const handleClose = () => {
    setOpen(false)
  }

  const [activeLocation] = useActiveLocation()
  const locations = useAllLocationsData()
  const [metric, demographic] = useActiveOptions()

  // useEffect(() => {
  //   if (open) {
  //   }
  // }, [open])

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}>
      <DialogTitle
        id="customized-dialog-title"
        title="Modal Title"
        subtitle="location name"
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
