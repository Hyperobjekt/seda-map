import React from 'react'
import { SidePanelGroup } from '../../../../shared'
import SedaDemographicPanel from './SedaDemographicPanel'
import SedaMetricPanel from './SedaMetricPanel'
import SedaRegionPanel from './SedaRegionPanel'
import SedaFilterPanel from './SedaFilterPanel'
import SedaLocationListPanel from './SedaLocationListPanel'
import { useHelpVisibility, SedaHelpPanel } from '../../help'
import {
  useActiveLocation,
  SedaLocationPanel
} from '../../location'
import useCondensedPanel from '../hooks/useCondensedPanel'
import useActivePanel from '../hooks/useActivePanel'
import SedaCollapsePanel from './SedaCollapsePanel'
import useIsMobile from '../../app/hooks/useIsMobile'

/**
 * A group containing all panels within the tool
 */
const SedaPanelGroup = props => {
  const [showHelp] = useHelpVisibility()
  const [activeLocation] = useActiveLocation()
  const [condensed] = useCondensedPanel()
  const [selection, setSelection] = useActivePanel()
  const isMobile = useIsMobile()

  // boolean that determines if condensed panel is shown
  const isCondensedPanel =
    condensed || selection || activeLocation || showHelp

  const handlePanelClose = () => setSelection(null)

  return (
    <SidePanelGroup
      condensed={condensed}
      maxVisible={1}
      {...props}>
      <SedaHelpPanel
        className="panel--help"
        open={showHelp}
        style={{ zIndex: 1001 }}>
        Help Panel
      </SedaHelpPanel>
      <SedaCollapsePanel
        className="panel--collapse"
        style={{
          zIndex: condensed || showHelp ? 998 : 999
        }}
        condensed={isCondensedPanel}
        offset={0}
        open={isMobile ? selection === 'options' : true}
      />
      <SedaMetricPanel
        className="panel--selection panel--metric"
        style={{ zIndex: 999 }}
        offset={showHelp ? 1 : 0}
        open={selection === 'metric'}
        onClose={handlePanelClose}
      />
      <SedaRegionPanel
        className="panel--selection panel--region"
        style={{ zIndex: 999 }}
        offset={showHelp ? 1 : 0}
        open={selection === 'region'}
        onClose={handlePanelClose}
      />
      <SedaDemographicPanel
        className="panel--selection panel--demographic"
        style={{ zIndex: 999 }}
        offset={showHelp ? 1 : 0}
        open={selection === 'demographic'}
        onClose={handlePanelClose}
      />
      <SedaFilterPanel
        className="panel--selection panel--filter"
        style={{ zIndex: 999 }}
        offset={showHelp ? 1 : 0}
        open={selection === 'filter'}
        onClose={handlePanelClose}
      />
      <SedaLocationListPanel
        className="panel--selection panel--location-list"
        style={{ zIndex: 999 }}
        offset={showHelp ? 1 : 0}
        open={selection === 'location'}
        onClose={handlePanelClose}
      />
      <SedaLocationPanel
        className="panel--location"
        open={activeLocation}
        offset={showHelp ? 1 : 0}
        style={{
          zIndex: 1000
        }}
      />
    </SidePanelGroup>
  )
}

SedaPanelGroup.propTypes = {}

export default SedaPanelGroup
