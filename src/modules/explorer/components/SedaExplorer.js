import React from 'react'
import PropTypes from 'prop-types'
import SedaMap from '../map'
import { SplitView } from './base/SplitView'
import SedaPanelGroup from './panels/SedaPanelGroup'
import { useActiveView } from '../hooks'
import { PageBody } from '../../../shared'
import SedaRouting from '../routing/SedaRouting'
import { SedaScatterplot } from '../scatterplot'
import { SedaTooltip } from '../tooltip'

const SedaExplorer = props => {
  const [view] = useActiveView()

  // determines the active portion of the split view
  const splitView =
    view === 'chart' ? 'right' : view === 'map' ? 'left' : view

  return (
    <PageBody {...props}>
      <SedaRouting />
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
