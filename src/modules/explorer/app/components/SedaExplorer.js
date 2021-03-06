import React from 'react'
import SedaMap from '../../map'
import { PageBody, SplitView } from '../../../../shared'
import { SedaScatterplot } from '../../scatterplot'
import { SedaTooltip } from '../../tooltip'
import { useActiveView } from '../hooks'
import { SedaPanelGroup } from '../../panels'
import { SedaError } from '../../errors'
import useIsMobile from '../hooks/useIsMobile'
/**
 * Body of the explorer, consisting of side panel, splitview, tooltip, and alert area
 * @param {*} props
 */
const SedaExplorer = props => {
  const [view, , isEmbed] = useActiveView()

  // determines the active portion of the split view
  const splitView =
    view === 'chart' ? 'right' : view === 'map' ? 'left' : view

  const isMobile = useIsMobile()

  // show tooltips on non-mobile sizes or embeds
  const showTooltip = !isMobile || isEmbed

  return (
    <PageBody {...props}>
      {!isEmbed && <SedaPanelGroup />}
      <SplitView
        view={splitView}
        LeftComponent={
          isEmbed && view === 'chart' ? <></> : <SedaMap />
        }
        RightComponent={
          isEmbed && view === 'map' ? <></> : <SedaScatterplot />
        }
      />
      {showTooltip && <SedaTooltip />}
      <SedaError />
    </PageBody>
  )
}

export default SedaExplorer
