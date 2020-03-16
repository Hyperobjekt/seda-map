import React from 'react'
import PropTypes from 'prop-types'
import { Page, PageBody } from '../../../base/components/Page'
import SedaHeader from './Header/SedaHeader'
import SedaMenu from './SedaMenu'
import { makeStyles, Button } from '@material-ui/core'
import {
  SidePanel,
  SidePanelGroup
} from '../../../base/components/Panels/SidePanel'
import { Workspace } from './Workspace'
import useUiStore from '../hooks/useUiStore'
import HelpPanel from './SidePanels/HelpPanel'
import FullPanel from './SidePanels/FullPanel'
import CondensedPanel from './SidePanels/CondensedPanel'
import SelectionPanel from './SidePanels/SelectionPanel'
import useDataOptions from '../hooks/useDataOptions'
import {
  getTitleFromSelections,
  getSubtitleFromSelections
} from '../../../shared/selectors/lang'
import SedaTooltip from './SedaTooltip'

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
  return (
    <Page>
      <SedaHeader heading={heading} subheading={subheading} />
      <div className={classes.offset} />
      <SedaMenu />
      <PageBody>
        <SidePanelGroup condensed={condensed} maxVisible={1}>
          <CondensedPanel condensed open={condensed} />
          <HelpPanel open={showHelp}>Help Panel</HelpPanel>
          <FullPanel open={!condensed} />
          <SelectionPanel open={selection} />
          <SidePanel open={activeLocation}>
            Location Panel
          </SidePanel>
        </SidePanelGroup>
        <Workspace view={view}>
          {/* <Map>
            <MapLegend />
            <ChartOverlay />
          </Map>
          <Chart>
            <ChartLegend />
          </Chart> */}
        </Workspace>
      </PageBody>
      {/* <PageContent>
        <PanelGroup>
          <HelpPanel />
          <ControlPanel />
          <LocationPanel />
        </PanelGroup>
        <VisualizationWrapper>
          <SedaMap></SedaMap>
          <SedaChart></SedaChart>
        </VisualizationWrapper>
      </PageContent> */}
      {/* 

      <PageFooter></PageFooter> */}
      <SedaTooltip />
    </Page>
  )
}

SedaLayout.propTypes = {}

export default SedaLayout
