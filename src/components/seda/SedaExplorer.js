import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'

import {
  updateMapSize,
  loadRouteLocations,
  toggleGapChart,
  onMetricChange,
  loadFlaggedSchools
} from '../../actions'

import SplitSection from '../templates/SplitSection'
import SedaLocations from './SedaLocations'
import SedaMap from '../../modules/map'
import SedaChart from '../../modules/scatterplot/components/SedaChart'
import SedaHelp from './SedaHelp'
import SedaLocationPanel from './SedaLocationPanel'
import SedaTooltip from './SedaTooltip'
import SedaGapChart from '../../modules/scatterplot/components/SedaGapChart'
import { Button } from '@material-ui/core'
import { getLang } from '../../shared/selectors/lang'
import BubbleChartIcon from '@material-ui/icons/BubbleChart'
import EmbedDialog from '../organisms/Embed/EmbedDialog'
import { ShareLinkDialog } from '../organisms/Share'

const Charts = ({ hasGapChart, showGapChart, sectionId, onChartToggle }) => {
  return (
    <div
      className={classNames('charts__root', {
        'charts__root--split': showGapChart && sectionId === 'chart',
        'charts__root--secondary': showGapChart
      })}>
      <SedaChart />
      {showGapChart && <SedaGapChart />}
      {hasGapChart && (
        <Button
          className="charts__toggle button--link"
          onClick={() => onChartToggle(!showGapChart)}>
          <BubbleChartIcon />
          {showGapChart
            ? getLang('BUTTON_HIDE_CHART')
            : getLang('BUTTON_SHOW_CHART')}
        </Button>
      )}
    </div>
  )
}

Charts.propTypes = {
  hasGapChart: PropTypes.bool,
  showGapChart: PropTypes.bool,
  sectionId: PropTypes.string,
  onChartToggle: PropTypes.func
}

/** Returns true if the demographic has a gap chart */
const hasGapChart = demographic => {
  return ['wh', 'wb', 'pn'].indexOf(demographic) > -1
}

const ExplorerView = ({
  loadRouteLocations,
  locations,
  selected,
  locationActive,
  helpOpen,
  view,
  demographic,
  gapChart,
  region,
  canRender,
  activeView,
  onMetricChange,
  onLayoutChange,
  onToggleGapChart,
  loadFlaggedSchools
}) => {
  // use state to track if the intro is on / off
  // const [introOn, setIntroOn] = useState(false);

  // load locations and flag potential layout change afterwards
  useEffect(() => {
    loadRouteLocations(locations, region).then(() => {
      // set map size when locations load
      onLayoutChange('map')
    })
    // eslint-disable-next-line
  }, []) // empty array so this only happens on mount

  // load flagged schools
  useEffect(() => {
    loadFlaggedSchools()
    // eslint-disable-next-line
  }, []) // empty array so this only happens on mount

  // flag potential layout change when there are 0 or 1 locations
  useEffect(() => {
    if (!selected) {
      return
    }
    if (selected.length === 0 || selected.length === 1) {
      onLayoutChange('map')
    }
    // eslint-disable-next-line
  }, [selected])

  // flag layout change when view, helpOpen changes
  useEffect(() => {
    onLayoutChange(view)
    // eslint-disable-next-line
  }, [view, helpOpen, locationActive])

  const handleToggleGapChart = visible => onToggleGapChart(visible, demographic)

  return (
    <>
      <SedaTooltip />
      <SplitSection
        id="map"
        classes={{ root: 'section--explorer' }}
        helpPanelOn={helpOpen}
        locationPanelOn={locationActive}
        activeView={activeView}
        rightComponent={canRender && <SedaMap />}
        leftComponent={
          canRender && (
            <Charts
              hasGapChart={hasGapChart(demographic)}
              showGapChart={
                region !== 'schools' && hasGapChart(demographic) && gapChart
              }
              sectionId={view}
              onChartToggle={handleToggleGapChart}
            />
          )
        }
        footerContent={canRender && <SedaLocations />}>
        {canRender && <SedaHelp />}
        {canRender && <SedaLocationPanel />}
      </SplitSection>
      <EmbedDialog />
      <ShareLinkDialog />
    </>
  )
}

ExplorerView.propTypes = {
  view: PropTypes.string,
  selected: PropTypes.array,
  locations: PropTypes.string,
  helpOpen: PropTypes.bool,
  activeView: PropTypes.string,
  locationActive: PropTypes.bool,
  onMetricChange: PropTypes.func,
  onLayoutChange: PropTypes.func,
  loadRouteLocations: PropTypes.func,
  demographic: PropTypes.string,
  gapChart: PropTypes.bool,
  classes: PropTypes.object,
  onToggleGapChart: PropTypes.func,
  loadFlaggedSchools: PropTypes.func
}

const mapStateToProps = (
  { selected, ui: { helpOpen }, active, sections: { gapChart } },
  {
    match: {
      params: { metric, locations, region, view, demographic }
    }
  }
) => ({
  gapChart,
  view,
  demographic,
  helpOpen,
  region,
  locations,
  selected: selected[region],
  locationActive: Boolean(active),
  canRender:
    Boolean(metric) && Boolean(demographic) && Boolean(view) && Boolean(region),
  activeView: view === 'map' ? 'right' : view === 'chart' ? 'left' : 'split'
})

const mapDispatchToProps = dispatch => ({
  loadRouteLocations: (locations, region) =>
    dispatch(loadRouteLocations(locations, region)),
  loadFlaggedSchools: () => dispatch(loadFlaggedSchools()),
  onLayoutChange: view =>
    ['map', 'split'].indexOf(view) > -1 && dispatch(updateMapSize()),
  onMetricChange: metricId => dispatch(onMetricChange(metricId)),
  onToggleGapChart: (visible, demographicId) => {
    dispatch(toggleGapChart(visible, demographicId))
  }
})

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ExplorerView)
