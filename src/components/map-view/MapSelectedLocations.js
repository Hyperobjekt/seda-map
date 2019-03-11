import React from 'react'
import { connect } from 'react-redux'; 
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom';
import MapLocation from './MapLocation';
import { compose } from 'redux';
import { onRemoveSelectedFeature, onViewportChange, showReportCard, hideReportCard } from '../../actions/mapActions';
import MenuList from '@material-ui/core/MenuList';
import { getLocationFromFeature, parseLocationsString } from '../../modules/router';
import { onHoverFeature, onCoordsChange } from '../../actions/mapActions';


const MapSelectedLocations = ({ 
  selected, 
  removeLocation, 
  navigateToLocation,
  onHoverFeature, 
  colors,
  showReportCard
}) => {
  return (
    <div className="map-locations">
      <MenuList>
        {selected.map((s, i) =>
            <MapLocation 
              key={s.id}
              number={i+1}
              {...s.properties}
              color={colors[i % colors.length]}
              onLocationClick={() => navigateToLocation(s)}
              onDismissClick={() => removeLocation(s)}
              onReportClick={() => showReportCard(s.properties.id)}
              onMouseOver={() => onHoverFeature(s) }
              onMouseOut={() => onHoverFeature(null)}
            /> 
        )}
      </MenuList>
    </div>
  )
}

MapSelectedLocations.propTypes = {
  selected: PropTypes.array,
  removeLocation: PropTypes.any,
  navigateToLocation: PropTypes.any,
  onHoverFeature: PropTypes.any,
  colors: PropTypes.array,
  showReportCard: PropTypes.func,
}

const mapStateToProps = ({ selected, features }, {  
  match: { params: { region } } 
}) => ({ 
  colors: selected.colors,
  selected: selected[region]
    .map(k => features[k])
})

const mapDispatchToProps = (dispatch) => ({
  removeLocation: (feature) => 
    dispatch(onRemoveSelectedFeature(feature)),
  onHoverFeature: (feature) => (
    dispatch(onHoverFeature(feature)) &&
    dispatch(onCoordsChange(null))
  ),
  showReportCard: (id) => dispatch(showReportCard(id)),
  hideReportCard,
  navigateToLocation: (feature) => {
    const l = parseLocationsString(
      getLocationFromFeature(feature)
    )[0];
    if (l) {
      dispatch(onViewportChange({ 
        latitude: parseFloat(l.lat), 
        longitude: parseFloat(l.lon),
        zoom: l.id.length + 2
      }, true))
    }
  }
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(MapSelectedLocations)


