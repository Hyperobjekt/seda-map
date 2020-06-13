import React from 'react'
import { Page, PageBody } from '../../../shared/components/Page'
import { SedaHeader } from './header'
import SedaMenu from './SedaMenu'
import { makeStyles } from '@material-ui/core'
import SedaTooltip from './SedaTooltip'
import SedaFooter from './SedaFooter'
import { useActiveView } from '../hooks'
import SedaError from './SedaError'
import SedaRouteManager from './SedaRouteManager'
import SedaScatterplot from './scatterplot/SedaScatterplot'
import SedaMap from './map'
import { SplitView } from './base/SplitView'
import SedaPanelGroup from './panels/SedaPanelGroup'

const useStyles = makeStyles(theme => ({
  offset: theme.mixins.toolbar,
  body: {
    overflow: 'hidden'
  },
  error: {
    position: 'absolute',
    bottom: 64,
    right: 24,
    zIndex: 999
  }
}))

const SedaLayout = () => {
  const classes = useStyles()
  const [view] = useActiveView()

  // determines the active portion of the split view
  const splitView =
    view === 'chart' ? 'right' : view === 'map' ? 'left' : view

  return (
    <Page>
      <SedaRouteManager />
      <SedaHeader />
      <div className={classes.offset} />
      <SedaMenu />
      <PageBody classes={{ root: classes.body }}>
        <SedaPanelGroup />
        <SplitView
          view={splitView}
          LeftComponent={<SedaMap />}
          RightComponent={<SedaScatterplot />}
        />
      </PageBody>
      <SedaFooter />
      <SedaTooltip />
      <SedaError className={classes.error} />
    </Page>
  )
}

SedaLayout.propTypes = {}

export default SedaLayout
