import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { getPrefixLang } from '../../../app/selectors/lang'
import {
  SelectionButton,
  useDidUpdateEffect,
  usePrevious
} from '../../../../../shared'
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
  panelId,
  primaryFormatter,
  secondaryFormatter,
  ...props
}) => {
  const classes = useStyles()
  const buttonRef = useRef(null)
  const [activePanel, setActivePanel] = useActivePanel()
  const prevActivePanel = usePrevious(activePanel)
  // Restore focus to appropriate element on panel close
  useDidUpdateEffect(() => {
    if (
      !activePanel &&
      prevActivePanel === panelId &&
      buttonRef.current
    ) {
      console.log(
        'restore focus',
        activePanel,
        prevActivePanel,
        buttonRef.current
      )
      buttonRef.current.querySelector("[role='button']").focus()
    }
  }, [activePanel, prevActivePanel, panelId, buttonRef.current])
  return (
    <SelectionButton
      ref={buttonRef}
      className={classes.root}
      active={activePanel === panelId}
      primary={primaryFormatter(panelId)}
      secondary={secondaryFormatter(panelId)}
      onClick={() => setActivePanel(panelId)}
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
