import React from 'react'
import PropTypes from 'prop-types'
import { SedaLocationSelect } from '../../location'
import { getLang, getPrefixLang } from '../../app/selectors/lang'
import { BasicSidePanel } from '../../../../shared'
import { CompareButton } from '../../compare'
import PanelDescription from './PanelDescription'

/**
 * Side panel for demographic selection
 */
const SedaLocationListPanel = ({ onClose, ...props }) => {
  return (
    <BasicSidePanel
      title={getPrefixLang('location', 'PANEL_TITLE')}
      footer={<CompareButton />}
      onClose={onClose}
      {...props}>
      <SedaLocationSelect onSelect={onClose} />
      <PanelDescription>
        { getLang("PANEL_DESCRIPTION_LOCATIONS") }
      </PanelDescription>
    </BasicSidePanel>
  )
}

SedaLocationListPanel.propTypes = {
  onClose: PropTypes.func
}

export default SedaLocationListPanel
