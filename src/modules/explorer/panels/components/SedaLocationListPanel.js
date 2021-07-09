import React from 'react'
import PropTypes from 'prop-types'
import { SedaLocationSelect } from '../../location'
import { getLang, getPrefixLang } from '../../app/selectors/lang'
import { BasicSidePanel } from '../../../../shared'
import { CompareButton } from '../../compare'
import PanelDescription from './PanelDescription'
import { withStyles } from '@material-ui/core'

const StyledCompareButton = withStyles(theme => ({
  root: {
    flex: 1,
    color: theme.palette.primary.main,
    padding: '6px 6px 5px',
    border: '1px solid',
    borderColor: theme.palette.divider,
    margin: '5px',
    '& .MuiSvgIcon-root': {
      width: '18px',
      position: 'relative',
      marginRight: '2px',
      top: '2px'
    }
  }
}))(CompareButton)

/**
 * Side panel for demographic selection
 */
const SedaLocationListPanel = ({ onClose, ...props }) => {
  return (
    <BasicSidePanel
      title={getPrefixLang('location', 'PANEL_TITLE')}
      footer={<StyledCompareButton />}
      onClose={onClose}
      {...props}>
      <SedaLocationSelect onSelect={onClose} />
      <PanelDescription>
        {getLang('PANEL_DESCRIPTION_LOCATIONS')}
      </PanelDescription>
    </BasicSidePanel>
  )
}

SedaLocationListPanel.propTypes = {
  onClose: PropTypes.func
}

export default SedaLocationListPanel
