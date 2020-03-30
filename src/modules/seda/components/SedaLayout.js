import React from 'react'
import PropTypes from 'prop-types'
import { Page, PageBody } from '../../../base/components/Page'
import { SedaHeader } from './header'
import SedaMenu from './SedaMenu'
import { makeStyles, Button } from '@material-ui/core'
import {
  SidePanel,
  SidePanelGroup
} from '../../../base/components/Panels/SidePanel'
import { SplitView } from './SplitView'
import useUiStore from '../hooks/useUiStore'
import {
  CondensedPanel,
  SelectionPanel,
  FullPanel,
  HelpPanel,
  LocationPanel
} from './panels'
import useDataOptions from '../hooks/useDataOptions'
import SedaTooltip from './SedaTooltip'
import SedaFooter from './SedaFooter'
import FilterSelectionPanel from './panels/FilterSelectionPanel'

const drawerWidth = 360

const useStyles = makeStyles(theme => ({
  offset: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  },
  body: {
    overflow: 'hidden'
  }
}))

const SedaLayout = props => {
  const classes = useStyles()
  const showHelp = useUiStore(state => state.showHelp)
  const activeLocation = useDataOptions(
    state => state.activeLocation
  )
  const condensed = useUiStore(state => state.condensed)
  const toggleCondensed = useUiStore(
    state => state.toggleCondensed
  )
  const filterPanel = useUiStore(state => state.filterPanel)
  const view = useUiStore(state => state.view)
  const selection = useUiStore(state => state.selection)

  // determines the active portion of the split view
  const splitView =
    view === 'chart' ? 'right' : view === 'map' ? 'left' : view
  return (
    <Page>
      <SedaHeader />
      <div className={classes.offset} />
      <SedaMenu />
      <PageBody classes={{ root: classes.body }}>
        <SidePanelGroup condensed={condensed} maxVisible={1}>
          <HelpPanel open={showHelp} style={{ zIndex: 1001 }}>
            Help Panel
          </HelpPanel>
          <CondensedPanel
            style={{ zIndex: 1000 }}
            condensed
            open={condensed}
          />

          <FullPanel
            style={{
              zIndex: condensed || showHelp ? 998 : 999
            }}
            open={!condensed}
          />
          <SelectionPanel
            style={{ zIndex: 999 }}
            open={selection}
          />
          <FilterSelectionPanel
            style={{
              zIndex: 999,
              transform: 'translateX(-100%)'
            }}
            open={filterPanel}
          />
          <LocationPanel
            open={activeLocation}
            style={{
              zIndex: 1000,
              transform: 'translateX(-100%)'
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
