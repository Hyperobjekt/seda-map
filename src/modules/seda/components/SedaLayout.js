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
  HelpPanel
} from './panels'
import useDataOptions from '../hooks/useDataOptions'
import {
  getTitleFromSelections,
  getSubtitleFromSelections
} from '../../../shared/selectors/lang'
import SedaTooltip from './SedaTooltip'
import SedaFooter from './SedaFooter'

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
  const activeLocation = useUiStore(
    state => state.activeLocation
  )
  const condensed = useUiStore(state => state.condensed)
  const toggleCondensed = useUiStore(
    state => state.toggleCondensed
  )
  const view = useUiStore(state => state.view)
  const selection = useUiStore(state => state.selection)
  const [metric, demographic, region] = useDataOptions(state => [
    state.metric,
    state.demographic,
    state.region
  ])
  const heading = getTitleFromSelections({
    metric,
    demographic,
    region
  })
  const subheading = getSubtitleFromSelections({
    metric,
    demographic,
    region
  })
  // determines the active portion of the split view
  const splitView =
    view === 'chart' ? 'right' : view === 'map' ? 'left' : view
  return (
    <Page>
      <SedaHeader heading={heading} subheading={subheading} />
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

          <FullPanel open={!condensed} />
          <SelectionPanel open={selection} />
          <SidePanel open={activeLocation}>
            Location Panel
          </SidePanel>
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
