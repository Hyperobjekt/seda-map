import React from 'react'
import PropTypes from 'prop-types'
import SedaDemographicSelect from './SedaDemographicSelect'
import { getPrefixLang } from '../../app/selectors/lang'
import { BasicSidePanel } from '../../../../shared'

/**
 * Side panel for demographic selection
 */
const SedaDemographicPanel = ({ onClose, ...props }) => {
  return (
    <BasicSidePanel
      title={getPrefixLang('demographic', 'PANEL_TITLE')}
      onClose={onClose}
      {...props}>
      <SedaDemographicSelect onSelect={onClose} />
    </BasicSidePanel>
  )
}

SedaDemographicPanel.propTypes = {
  onClose: PropTypes.func
}

export default SedaDemographicPanel
