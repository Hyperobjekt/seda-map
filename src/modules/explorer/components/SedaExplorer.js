import React from 'react'
import PropTypes from 'prop-types'
import SedaRouteManager from './SedaRouteManager'
import SedaScatterplot from './scatterplot/SedaScatterplot'
import SedaMap from './map'
import { SplitView } from './base/SplitView'
import SedaPanelGroup from './panels/SedaPanelGroup'
import { useActiveView } from '../hooks'
import SedaTooltip from './SedaTooltip'
import { PageBody } from '../../../shared/components/Page'

const SedaExplorer = props => {
  const [view] = useActiveView()

  // determines the active portion of the split view
  const splitView =
    view === 'chart' ? 'right' : view === 'map' ? 'left' : view

  return (
    <PageBody {...props}>
      <SedaRouteManager />
      <SedaPanelGroup />
      <SplitView
        view={splitView}
        LeftComponent={<SedaMap />}
        RightComponent={<SedaScatterplot />}
      />
      <SedaTooltip />
    </PageBody>
  )
}

SedaExplorer.propTypes = {}

export default SedaExplorer
