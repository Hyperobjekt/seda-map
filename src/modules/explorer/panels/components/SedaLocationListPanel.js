import React from 'react'
import PropTypes from 'prop-types'
import { SedaLocationSelect } from '../../location'
import { getPrefixLang } from '../../app/selectors/lang'
import { BasicSidePanel } from '../../../../shared'

/**
 * Side panel for demographic selection
 */
const SedaLocationListPanel = ({ onClose, ...props }) => {
  return (
    <BasicSidePanel
      title={getPrefixLang('location', 'PANEL_TITLE')}
      onClose={onClose}
      {...props}>
      <SedaLocationSelect onSelect={onClose} />
    </BasicSidePanel>
  )
}

SedaLocationListPanel.propTypes = {
  onClose: PropTypes.func
}

export default SedaLocationListPanel
