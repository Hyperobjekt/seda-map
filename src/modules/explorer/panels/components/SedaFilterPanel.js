import React from 'react'
import PropTypes from 'prop-types'
import { SedaFiltersForm } from '../../filters'
import { getPrefixLang } from '../../app/selectors/lang'
import { BasicSidePanel } from '../../../../shared'
import { Box, Button, Typography } from '@material-ui/core'

const PanelHeader = props => {
  return (
    <Box
      width="100%"
      alignItems="center"
      display="flex"
      justifyContent="space-between">
      <Typography
        style={{
          fontWeight: 'normal',
          fontFamily:
            'maisonneue-bold,lato,helvetica neue,Arial,sans-serif,-apple-system'
        }}>
        {getPrefixLang('filter', 'PANEL_TITLE')}
      </Typography>
      <Button style={{ padding: `6px 12px 4px`, lineHeight: 1, marginRight: 8}} variant="outlined">Reset Filters</Button>
    </Box>
  )
}

/**
 * Side panel for demographic selection
 */
const SedaFilterPanel = ({ onClose, ...props }) => {
  return (
    <BasicSidePanel
      title={<PanelHeader />}
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
