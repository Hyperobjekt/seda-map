import React from 'react'
import PropTypes from 'prop-types'
import SedaDemographicSelect from './SedaDemographicSelect'
import { getPrefixLang } from '../../app/selectors/lang'
import SedaSidePanel from './SedaSidePanel'

/**
 * Side panel for demographic selection
 */
const SedaDemographicPanel = ({ onClose, ...props }) => {
  return (
    <SedaSidePanel
      title={getPrefixLang('demographic', 'PANEL_TITLE')}
      onClose={onClose}
      {...props}>
      <SedaDemographicSelect onSelect={onClose} />
    </SedaSidePanel>
  )
}

SedaDemographicPanel.propTypes = {
  onClose: PropTypes.func
}

export default SedaDemographicPanel
