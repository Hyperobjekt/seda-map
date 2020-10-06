import React from 'react'
import PropTypes from 'prop-types'
import { SedaFiltersForm } from '../../filters'
import { getPrefixLang } from '../../app/selectors/lang'
import { BasicSidePanel } from '../../../../shared'

/**
 * Side panel for demographic selection
 */
const SedaFilterPanel = ({ onClose, ...props }) => {
  return (
    <BasicSidePanel
      title={getPrefixLang('filter', 'PANEL_TITLE')}
      onClose={onClose}
      {...props}>
      <SedaFiltersForm />
    </BasicSidePanel>
  )
}

SedaFilterPanel.propTypes = {
  onClose: PropTypes.func
}

export default SedaFilterPanel
