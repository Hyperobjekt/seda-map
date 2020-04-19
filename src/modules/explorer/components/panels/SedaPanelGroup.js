import React from 'react'
import {
  SedaCondensedPanel as CondensedPanel,
  SedaSelectionPanel as SelectionPanel,
  SedaFullPanel as FullPanel,
  SedaFilterSelection as FilterSelectionPanel,
  SedaHelpPanel as HelpPanel,
  SedaLocationPanel as LocationPanel
} from '.'
import {
  useHelpVisibility,
  useActiveLocation,
  useCondensed,
  useActiveFilterSelection,
  useActiveSelection
} from '../../hooks'
import { SidePanelGroup } from '../../../../shared/components/Panels/SidePanel'

const SedaPanelGroup = props => {
  const [showHelp] = useHelpVisibility()
  const [activeLocation] = useActiveLocation()
  const [condensed] = useCondensed()
  const [filterPanel] = useActiveFilterSelection()
  const [selection] = useActiveSelection()

  // boolean that determines when full panel is shown
  const isFullPanel =
    !condensed && !selection && !activeLocation && !showHelp

  // boolean that determines if condensed panel is shown
  const isCondensedPanel =
    condensed || selection || activeLocation || showHelp

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
      <SelectionPanel
        className="panel--selection"
        style={{ zIndex: 999 }}
        offset={1}
        open={selection}
      />
      <FilterSelectionPanel
        className="panel--filter"
        style={{
          zIndex: 999,
          transform: 'translateX(-100%)'
        }}
        open={filterPanel}
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
