import React from 'react'
import PropTypes from 'prop-types'
import SedaMetricSelect from '../../app/components/controls/SedaMetricSelect'
import { getPrefixLang } from '../../app/selectors/lang'
import SedaSidePanel from './SedaSidePanel'
import { Typography } from '@material-ui/core'

/**
 * Side panel for metric selection
 */
const SedaMetricPanel = ({ onClose, ...props }) => {
  return (
    <SedaSidePanel
      title={getPrefixLang('metric', 'PANEL_TITLE')}
      onClose={onClose}
      {...props}>
      <>
        <SedaMetricSelect onSelect={onClose} />
        <Typography
          style={{ display: 'block', padding: 16 }}
          variant="caption">
          The educational opportunity metrics above are based on
          test scores for students in grades 3 - 8 for the years
          2009 - 2016.
        </Typography>
      </>
    </SedaSidePanel>
  )
}

SedaMetricPanel.propTypes = {
  onClose: PropTypes.func
}

export default SedaMetricPanel
