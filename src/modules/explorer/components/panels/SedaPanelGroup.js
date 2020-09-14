import React from 'react'
import {
  SedaCondensedPanel as CondensedPanel,
  SedaSelectionPanel as SelectionPanel,
  SedaFullPanel as FullPanel,
  SedaHelpPanel as HelpPanel,
  SedaLocationPanel as LocationPanel
} from '.'
import {
  useHelpVisibility,
  useActiveLocation,
  useCondensed,
  useActiveSelection
} from '../../hooks'
import { SidePanelGroup } from '../../../../shared'
import SedaDemographicPanel from './SedaDemographicPanel'
import SedaMetricPanel from './SedaMetricPanel'
import SedaRegionPanel from './SedaRegionPanel'
import SedaFilterPanel from './SedaFilterPanel'
import SedaLocationListPanel from './SedaLocationListPanel'

/**
 * A group containing all panels within the tool
 */
const SedaPanelGroup = props => {
  const [showHelp] = useHelpVisibility()
  const [activeLocation] = useActiveLocation()
  const [condensed] = useCondensed()
  const [selection, setSelection] = useActiveSelection()

  // boolean that determines when full panel is shown
  const isFullPanel =
    !condensed && !selection && !activeLocation && !showHelp

  // boolean that determines if condensed panel is shown
  const isCondensedPanel =
    condensed || selection || activeLocation || showHelp

  const handlePanelClose = () => setSelection(null)

  return (
    <SidePanelGroup condensed={condensed} maxVisible={1}>
      <HelpPanel
        className="panel--help"
        open={showHelp}
        style={{ zIndex: 1001 }}>
        Help Panel
      </HelpPanel>
      <CondensedPanel
        className="panel--condensed"
        style={{ zIndex: 1000 }}
        offset={showHelp ? 1 : 0}
        condensed
        open={isCondensedPanel}
      />
      <FullPanel
        className="panel--full"
        style={{
          zIndex: condensed || showHelp ? 998 : 999,
          width: 384
        }}
        offset={showHelp ? 1 : 0}
        open={isFullPanel}
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
      {activeLocation && (
        <LocationPanel
          className="panel--location"
          open={activeLocation}
          style={{
            zIndex: 1000
          }}
        />
      )}
    </SidePanelGroup>
  )
}

SedaPanelGroup.propTypes = {}

export default SedaPanelGroup
