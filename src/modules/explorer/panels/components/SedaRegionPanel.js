import React from 'react'
import PropTypes from 'prop-types'
import SedaRegionSelect from '../../controls/SedaRegionSelect'
import { getPrefixLang } from '../../app/selectors/lang'
import {
  BasicSidePanel,
  SidePanelList
} from '../../../../shared'

/**
 * Side panel for demographic selection
 */
const SedaRegionPanel = ({ onClose, ...props }) => {
  return (
    <BasicSidePanel
      title={getPrefixLang('region', 'PANEL_TITLE')}
      onClose={onClose}
      {...props}>
      <SedaRegionSelect
        component={SidePanelList}
        onSelect={onClose}
        aria-label="region selection"
      />
    </BasicSidePanel>
  )
}

SedaRegionPanel.propTypes = {
  onClose: PropTypes.func
}

export default SedaRegionPanel
