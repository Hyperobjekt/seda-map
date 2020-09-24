import React from 'react'
import PropTypes from 'prop-types'
import SedaScatterplot from './scatterplot/SedaScatterplot'
import SedaMap from './map'
import { SplitView } from './base/SplitView'
import SedaPanelGroup from './panels/SedaPanelGroup'
import { useActiveView } from '../hooks'
import SedaTooltip from './SedaTooltip'
import { PageBody } from '../../../shared'
import useRouting from '../hooks/useRouting'

const SedaExplorer = props => {
  const [view] = useActiveView()

  useRouting()

  // determines the active portion of the split view
  const splitView =
    view === 'chart' ? 'right' : view === 'map' ? 'left' : view

  return (
    <PageBody {...props}>
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
