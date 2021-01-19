import React, { useCallback } from 'react'
import SedaMap from '../../map'
import { PageBody, SplitView } from '../../../../shared'
import { SedaScatterplot } from '../../scatterplot'
import { SedaTooltip } from '../../tooltip'
import { useActiveView } from '../hooks'
import { SedaPanelGroup } from '../../panels'
import { SedaError } from '../../errors'
import useIsMobile from '../hooks/useIsMobile'
import useAnalytics from '../hooks/useAnalytics'
/**
 * Body of the explorer, consisting of side panel, splitview, tooltip, and alert area
 * @param {*} props
 */
const SedaExplorer = props => {
  const [view, , isEmbed] = useActiveView()
  useAnalytics()

  // determines the active portion of the split view
  const splitView =
    view === 'chart' ? 'right' : view === 'map' ? 'left' : view

  const isMobile = useIsMobile()

  const embedListener = useCallback(() => {
    if (!isEmbed) return

    // open new tab with same settings, without 'embed' mode or '+secondary' flag
    window.open(
      window.location.href
        .split('+secondary')
        .join('')
        .split('/embed')
        .join('')
    )
  }, [isEmbed])

  return (
    <PageBody {...props}>
      {!isEmbed && <SedaPanelGroup />}
      <SplitView
        view={splitView}
        onClick={embedListener}
        LeftComponent={
          isEmbed && view === 'chart' ? <></> : <SedaMap />
        }
        RightComponent={
          isEmbed && view === 'map' ? <></> : <SedaScatterplot />
        }
      />
      {!isMobile && <SedaTooltip /> }
      <SedaError />
    </PageBody>
  )
}

export default SedaExplorer
