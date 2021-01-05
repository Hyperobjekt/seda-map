import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { InputAdornment, IconButton } from '@material-ui/core'
import CopyIcon from '@material-ui/icons/FileCopy'
import copy from 'copy-to-clipboard'
import { onShare } from '../actions'
import { getLang } from '../../app/selectors/lang'
import {
  useLinkDialogVisibility,
} from '..'

export const ShareLinkDialog = () => {
  const [copied, setCopied] = React.useState(false)
  const [open, toggleLinkDialog] = useLinkDialogVisibility()

  const handleFocus = event => event.target.select()

  return (
    <Dialog
      className="dialog dialog__container"
      classes={{ paper: 'dialog__container' }}
      open={open}
      onClose={toggleLinkDialog}
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        {getLang('LINK_DIALOG_TITLE')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {getLang('LINK_INSTRUCTIONS')}
        </DialogContentText>
        <TextField
          label={getLang('LINK_INPUT_LABEL')}
          type="text"
          value={window.location.href}
          fullWidth
          onFocus={handleFocus}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  aria-label={getLang('LINK_COPY_LABEL')}
                  onClick={() => {
                    copy(window.location.href)
                    onShare(window.location.href, 'link')
                    setCopied(true)
                  }}>
                  <CopyIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        {copied && <span className="copied">Copied!</span>}
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleLinkDialog} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}