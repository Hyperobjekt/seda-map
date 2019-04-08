import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';

import SedaMap from '../map/SedaMap';
import MapScatterplot from '../map/MapScatterplot';
import { loadRouteLocations } from '../../actions/featuresActions';
import { getRegionControl, getMetricControl, getDemographicControl, getHighlightControl, getChoroplethColors, getValuePositionForMetric } from '../../modules/config';
import MapLocationCards from '../map/MapLocationCards';
import MenuSentence from '../base/MenuSentence';
import MapTooltip from '../map/MapTooltip';
import MapSearch from '../map/MapSearch';
import { updateRoute } from '../../modules/router';
import { updateCurrentState, onViewportChange } from '../../actions/mapActions';
import { getStateProp } from '../../constants/statesFips';
import LANG from '../../constants/lang';
import GradientLegend from '../base/GradientLegend';
import { getFeatureProperty } from '../../modules/features';


const MapSection = ({
  id,
  name,
  headerMenu,
  selectedLocationCount,
  xVar,
  yVar,
  legend,
  onOptionChange
}) => {
  return (
    <div id={id} name={name} className="section section--map">
      <MapTooltip />
      <div className="section__header">
        <MenuSentence
          className="section__heading"
          text="Map of $1 for $2 by $3"
          controls={headerMenu.controls}
          variant="h5"
          onChange={onOptionChange}
        />
        <Typography className="section__description">
          { yVar.split('_')[1] === 'avg' ?
            <span>
              The average test scores of children in a community reveal the total 
              set of educational opportunities they have had from birth to the time 
              they take the tests. The map and scatterplot below shows how educational
              opportunity is correlated with socioeconomic status.  How does your 
              area compare?
            </span> :
            <span>Description for metric unavailable.</span>
          }
        </Typography>
      </div>
      <div className="section__body">

        <div className="section__places">
          <MapLocationCards section="map" metrics={[yVar, xVar]}>
            <div className="location-card location-card--search">
              <Typography component="p" className="helper helper--card-search">
                { LANG['CARD_SEARCH_HELPER'] }
              </Typography>
            </div>
          </MapLocationCards>
        </div>

        {/* Hack approach to overlay search on top of visualization */}
        <div className="section__places section__places--overlay">
          <div className="location-card-list">
            {
              Boolean(selectedLocationCount) && 
              [...Array(selectedLocationCount)].map((_, i) =>
                <div key={'pchld-'+i} className="location-card"></div>
              )
            }
            <div className="location-card location-card--search">
              <MapSearch
                inputProps={{
                  placeholder: LANG['CARD_SEARCH_PLACEHOLDER']
                }}
              />
            </div>
          </div>
        </div>
        
      
        <div className="section__component">

          <div className="section__controls">
            <MenuSentence
              {...headerMenu}
              onChange={onOptionChange}
            />
            
          </div>
          
          <div className="section__right">
            <SedaMap />
          </div>
          <div className="section__left section__left--scatterplot">
            <MapScatterplot />
            <GradientLegend
              {...legend}
            />
          </div>
        </div>
      </div>
      
    </div>
  )
}

MapSection.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  headerMenu: PropTypes.shape({
    text: PropTypes.string,
    controls: PropTypes.array,
  }),
  selectedLocationCount: PropTypes.number,
  xVar: PropTypes.string,
  yVar: PropTypes.string,
  onOptionChange: PropTypes.func,
  legend: PropTypes.shape({
    colors: PropTypes.array.isRequired,
    startLabel: PropTypes.string,
    endLabel: PropTypes.string,
  })
}

const mapStateToProps = ({ 
  scatterplot: { loaded },
  selected,
  sections: { map: { hovered } },
  map: { usState },
},
{ match: { params: { region, metric, demographic } } }
) => {
  return ({
    yVar: demographic + '_' + metric,
    xVar: demographic + '_ses',
    selectedLocationCount: 
      selected && selected[region] && selected[region].length ?
        selected[region].length : 0, 
    mapScatterplotLoaded: loaded && loaded['map'],
    highlightedState: usState,
    legend: {
      colors: getChoroplethColors(),
      markerPosition: hovered ?
        getValuePositionForMetric(
          getFeatureProperty(hovered, demographic + '_' + metric),
          metric
        ) : null,
      vertical: true
    },
    headerMenu: {
      text: usState ?
        "Showing $1 for $2 by $3 in $4" :
        "Showing $1 for $2 by $3 in the $4",
      controls: [
        getMetricControl(metric),
        getDemographicControl(demographic),
        getRegionControl(region),
        getHighlightControl(usState)
      ],
    }
  })
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadRouteLocations: (locations) => 
    dispatch(loadRouteLocations(locations)),
  onOptionChange: (id, option) => {
    switch(id) {
      case 'metric':
        return updateRoute(ownProps, { metric: option.id })
      case 'demographic':
        return updateRoute(ownProps, { demographic: option.id })
      case 'region':
        return updateRoute(ownProps, { region: option.id })
      case 'highlight':
        if (option.value === 'us') {
          dispatch(updateCurrentState(null))
        } else {
          const vp = {
            latitude: getStateProp(option.id, 'lat'),
            longitude: getStateProp(option.id, 'lon'),
            zoom: 5
          }
          dispatch(updateCurrentState(option.id))
          dispatch(onViewportChange(vp, true))
        }
        return;
      default:
        return;
    }
  },
})

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(MapSection)
