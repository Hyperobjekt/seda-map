import React from 'react'
import SedaMap from '../../map'
import { PageBody, SplitView } from '../../../../shared'
import { SedaScatterplot } from '../../scatterplot'
import { SedaTooltip } from '../../tooltip'
import { useActiveView } from '../hooks'
import { SedaPanelGroup } from '../../panels'
import { SedaError } from '../../errors'
import { EmbedDialog } from '../../sharing/components/EmbedDialog'

/**
 * Body of the explorer, consisting of side panel, splitview, tooltip, and alert area
 * @param {*} props
 */
const SedaExplorer = props => {
  const [view] = useActiveView()

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
      <SedaError />
      <EmbedDialog />
    </PageBody>
  )
}

export default SedaExplorer
