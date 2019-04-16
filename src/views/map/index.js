
import { withRouter } from 'react-router-dom';
import React, { Component } from 'react'
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as Scroll from 'react-scroll'

import { loadRouteLocations } from '../../actions/featuresActions';
import SocioeconomicConditions from '../../components/sections/SocioeconomicConditionsSection';
import OpportunityDifferences from '../../components/sections/OpportunityDifferencesSection';
import AchievementGaps from '../../components/sections/AchievementGapSection';
import MapIntro from '../../components/sections/IntroSection';
import MapSection from '../../components/sections/MapSection';
import { updateRoute } from '../../modules/router';

const ScrollElement = Scroll.ScrollElement;
const ScrollLink = Scroll.Link;
const sectionIdComponentMap = { 
  'map': ScrollElement(MapSection), 
  'socioeconomic': ScrollElement(SocioeconomicConditions), 
  'opportunity': ScrollElement(OpportunityDifferences), 
  'achievement': ScrollElement(AchievementGaps)
};

export class MapView extends Component {
  static propTypes = {
    loadRouteLocations: PropTypes.any,
    match: PropTypes.object,
    demographic: PropTypes.string, 
    onDemographicChange: PropTypes.func,
    mapScatterplotLoaded: PropTypes.bool,
    selectedLocationCount: PropTypes.number,
    setMetric: PropTypes.func,
  }

  componentDidMount() { 
    this.props.loadRouteLocations(
      this.props.match.params.locations
    );

    Scroll.scrollSpy.update();
  }

  onSectionEnter(sectionId, sectionEl) {
    console.log('enter: ', sectionId)
  }

  onSectionExit(sectionId, sectionEl) {
    console.log('exit: ', sectionId)
  }

  render() {
    return (
      <div id="scrollWrapper" className="map-tool">
        <div>
        {
          Object.keys(sectionIdComponentMap).map(
            (k) => 
              <ScrollLink 
                containerId="scrollWrapper"
                key={k+'-link'}
                to={k}
                onSetActive={this.onSectionEnter}
                onSetInactive={this.onSectionExit}
                spy={true}
              />
          )
        }
        </div>
        <MapIntro
          onMeasureClick={(metricId) => {
            this.props.setMetric(metricId);
            Scroll.scroller.scrollTo('map', {
              duration: 400,
              smooth: true,
              containerId: 'scrollWrapper'
            })
          }}
        />
        {
          Object.keys(sectionIdComponentMap).map(
            (k) => {
              const Section = sectionIdComponentMap[k];
              return <Section 
                key={k+'-section'} 
                id={k} 
                name={k} 
                selectedLocationCount={this.props.selectedLocationCount}
              />
            }
          )
        }
      </div>
    )
  }
}

const mapStateToProps = (
  { scatterplot: { loaded }, selected },
  { match: { params: { region } } }
) => ({
  mapScatterplotLoaded: loaded && loaded['map'],
  selectedLocationCount: 
    selected && selected[region] && selected[region].length ?
      selected[region].length : 0, 
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadRouteLocations: (locations) => 
    dispatch(loadRouteLocations(locations)),
  setMetric: (metricId) => {
    updateRoute(ownProps, { metric: metricId })
  }
})

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(MapView)
