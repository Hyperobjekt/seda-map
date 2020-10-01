import React from 'react'
import PropTypes from 'prop-types'
import { getPrefixLang } from '../../app/selectors/lang'
import SedaSidePanel from '../../app/components/panels/SedaSidePanel'
import SedaFiltersForm from './SedaFiltersForm'

/**
 * Side panel for demographic selection
 */
const SedaFilterPanel = ({ onClose, ...props }) => {
  return (
    <SedaSidePanel
      title={getPrefixLang('filter', 'PANEL_TITLE')}
      onClose={onClose}
      {...props}>
      <SedaFiltersForm />
    </SedaSidePanel>
  )
}

SedaFilterPanel.propTypes = {
  onClose: PropTypes.func
}

export default SedaFilterPanel
