import React from 'react'
import PropTypes from 'prop-types'
import { getPrefixLang } from '../../../app/selectors/lang'
import { SelectionButton } from '../../../../../shared'
import useActivePanel from '../../hooks/useActivePanel'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: theme.app.panelWidth
  }
}))

/**
 * Button used for options in the full panel view
 */
const SedaPanelButton = ({
  selectionId,
  primaryFormatter,
  secondaryFormatter,
  ...props
}) => {
  const classes = useStyles()
  const [selection, setSelection] = useActivePanel()
  return (
    <SelectionButton
      className={classes.root}
      active={selection === selectionId}
      primary={primaryFormatter(selectionId)}
      secondary={secondaryFormatter(selectionId)}
      onClick={() => setSelection(selectionId)}
      {...props}
    />
  )
}

SedaPanelButton.defaultProps = {
  primaryFormatter: selectionId =>
    getPrefixLang(selectionId, 'PANEL_TITLE'),
  secondaryFormatter: selectionId =>
    getPrefixLang(selectionId, 'LABEL')
}

SedaPanelButton.propTypes = {
  /** identifier for what type of selection the button is for */
  selectionId: PropTypes.string,
  primaryFormatter: PropTypes.func,
  /** current value of the selection */
  value: PropTypes.string
}

export default SedaPanelButton
