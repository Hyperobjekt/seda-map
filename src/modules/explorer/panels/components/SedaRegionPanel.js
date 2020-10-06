import React from 'react'
import PropTypes from 'prop-types'
import SedaRegionSelect from './SedaRegionSelect'
import { getPrefixLang } from '../../app/selectors/lang'
import { BasicSidePanel } from '../../../../shared'

/**
 * Side panel for demographic selection
 */
const SedaRegionPanel = ({ onClose, ...props }) => {
  return (
    <BasicSidePanel
      title={getPrefixLang('region', 'PANEL_TITLE')}
      onClose={onClose}
      {...props}>
      <SedaRegionSelect onSelect={onClose} />
    </BasicSidePanel>
  )
}

SedaRegionPanel.propTypes = {
  onClose: PropTypes.func
}

export default SedaRegionPanel
