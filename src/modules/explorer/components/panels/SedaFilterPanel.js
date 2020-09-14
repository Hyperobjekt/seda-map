import React from 'react'
import PropTypes from 'prop-types'
import { getPrefixLang } from '../../selectors/lang'
import SedaSidePanel from './SedaSidePanel'
import SedaFiltersForm from '../filters/SedaFiltersForm'

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
