import React from 'react'
import PropTypes from 'prop-types'
import { getLang, getPrefixLang } from '../../app/selectors/lang'
import {
  BasicSidePanel,
  SidePanelList
} from '../../../../shared'
import PanelDescription from './PanelDescription'
import SedaSubgroupSelect from '../../controls/SedaSubgroupSelect'
import { useRegion } from '../../app/hooks'
import SedaGapSelect from '../../controls/SedaGapSelect'
import { ListSubheader } from '@material-ui/core'

/**
 * Side panel for demographic selection
 */
const SedaDemographicPanel = ({ onClose, ...props }) => {
  const [region] = useRegion()
  return (
    <BasicSidePanel
      title={getPrefixLang('demographic', 'PANEL_TITLE')}
      onClose={onClose}
      {...props}>
      <SedaSubgroupSelect
        component={SidePanelList}
        onSelect={onClose}
        subheader={
          <ListSubheader disableSticky>Subgroups</ListSubheader>
        }
        aria-label="subgroup selection"
      />
      {region === 'schools' && (
        <PanelDescription>
          {getLang('PANEL_DESCRIPTION_SUBGROUPS')}
        </PanelDescription>
      )}
      {region !== 'schools' && (
        <SedaGapSelect
          subheader={
            <ListSubheader disableSticky>Gaps</ListSubheader>
          }
          component={SidePanelList}
          onSelect={onClose}
          aria-label="difference between subgroups selection"
        />
      )}
      {region !== 'schools' && (
        <PanelDescription>
          {getLang('PANEL_DESCRIPTION_GAPS')}
        </PanelDescription>
      )}
    </BasicSidePanel>
  )
}

SedaDemographicPanel.propTypes = {
  onClose: PropTypes.func
}

export default SedaDemographicPanel
