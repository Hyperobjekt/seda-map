import React from 'react'
import { Page, PageBody } from '../../../base/components/Page'
import { SedaHeader } from './header'
import SedaMenu from './SedaMenu'
import { makeStyles } from '@material-ui/core'
import { SidePanelGroup } from '../../../base/components/Panels/SidePanel'
import { SplitView } from './SplitView'
import {
  SedaCondensedPanel as CondensedPanel,
  SedaSelectionPanel as SelectionPanel,
  SedaFullPanel as FullPanel,
  SedaFilterSelection as FilterSelectionPanel,
  SedaHelpPanel as HelpPanel,
  SedaLocationPanel as LocationPanel
} from './panels'
import SedaTooltip from './SedaTooltip'
import SedaFooter from './SedaFooter'
import {
  useHelpVisibility,
  useActiveLocation,
  useCondensed,
  useActiveView,
  useActiveFilterSelection,
  useActiveSelection
} from '../hooks'

const useStyles = makeStyles(theme => ({
  offset: theme.mixins.toolbar,
  body: {
    overflow: 'hidden'
  }
}))

const SedaLayout = () => {
  const classes = useStyles()
  const [showHelp] = useHelpVisibility()
  const [activeLocation] = useActiveLocation()
  const [condensed] = useCondensed()
  const [filterPanel] = useActiveFilterSelection()
  const [view] = useActiveView()
  const [selection] = useActiveSelection()

  // determines the active portion of the split view
  const splitView =
    view === 'chart' ? 'right' : view === 'map' ? 'left' : view

  // boolean that determines when full panel is shown
  const isFullPanel =
    !condensed && !selection && !activeLocation && !showHelp

  // boolean that determines if condensed panel is shown
  const isCondensedPanel =
    condensed || selection || activeLocation || showHelp
  return (
    <Page>
      <SedaHeader />
      <div className={classes.offset} />
      <SedaMenu />
      <PageBody classes={{ root: classes.body }}>
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
          <LocationPanel
            className="panel--location"
            open={activeLocation}
            style={{
              zIndex: 1000
            }}
          />
        </SidePanelGroup>
        <SplitView view={splitView} />
      </PageBody>
      <SedaFooter />
      <SedaTooltip />
    </Page>
  )
}

SedaLayout.propTypes = {}

export default SedaLayout
