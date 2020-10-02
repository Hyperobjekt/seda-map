import React from 'react'
import PropTypes from 'prop-types'
import { SedaLocationSelect } from '../../location'
import { getPrefixLang } from '../../app/selectors/lang'
import SedaSidePanel from './SedaSidePanel'

/**
 * Side panel for demographic selection
 */
const SedaLocationListPanel = ({ onClose, ...props }) => {
  return (
    <SedaSidePanel
      title={getPrefixLang('location', 'PANEL_TITLE')}
      onClose={onClose}
      {...props}>
      <SedaLocationSelect onSelect={onClose} />
    </SedaSidePanel>
  )
}

SedaLocationListPanel.propTypes = {
  onClose: PropTypes.func
}

export default SedaLocationListPanel
