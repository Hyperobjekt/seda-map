import React from 'react'
import { connect } from 'react-redux'
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
import { toggleLinkShareDialog } from './actions'
import { onShare } from './actions'
import { getLang } from '../../../../shared/selectors/lang'

export const ShareLinkDialog = ({
  open,
  shareUrl,
  onClose,
  onCopy
}) => {
  const [copied, setCopied] = React.useState(false)

  const handleFocus = event => event.target.select()

  return (
    <Dialog
      className="dialog dialog__container"
      classes={{ paper: 'dialog__container' }}
      open={open}
      onClose={onClose}
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
          value={shareUrl}
          fullWidth
          onFocus={handleFocus}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  aria-label={getLang('LINK_COPY_LABEL')}
                  onClick={() => {
                    copy(shareUrl)
                    setCopied(true)
                    onCopy()
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
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const mapStateToProps = state => ({
  open: state.ui.shareLinkOpen,
  shareUrl: window.location.href
})

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(toggleLinkShareDialog(false)),
  onCopy: () => {
    dispatch(onShare(window.location.href, 'link'))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareLinkDialog)
