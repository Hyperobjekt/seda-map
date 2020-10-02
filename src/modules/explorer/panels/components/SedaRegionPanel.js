import React from 'react'
import PropTypes from 'prop-types'
import SedaRegionSelect from './SedaRegionSelect'
import { getPrefixLang } from '../../app/selectors/lang'
import SedaSidePanel from './SedaSidePanel'

/**
 * Side panel for demographic selection
 */
const SedaRegionPanel = ({ onClose, ...props }) => {
  return (
    <SedaSidePanel
      title={getPrefixLang('region', 'PANEL_TITLE')}
      onClose={onClose}
      {...props}>
      <SedaRegionSelect onSelect={onClose} />
    </SedaSidePanel>
  )
}

SedaRegionPanel.propTypes = {
  onClose: PropTypes.func
}

export default SedaRegionPanel
