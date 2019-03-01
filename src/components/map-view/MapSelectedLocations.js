import React from 'react'
import { connect } from 'react-redux'; 
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom';
import MapLocation from './MapLocation';
import { compose } from 'redux';
import { onRemoveSelectedFeature, onViewportChange } from '../../actions/mapActions';
import MenuList from '@material-ui/core/MenuList';
import { getLocationFromFeature, parseLocationsString } from '../../modules/router';
import { onHoverFeature, onCoordsChange } from '../../actions/mapActions';


const MapSelectedLocations = ({ 
  selected, 
  removeLocation, 
  navigateToLocation,
  onHoverFeature, 
  colors
}) => {
  return (
    <div className="map-locations">
      <MenuList>
        {selected.map((s, i) =>
            <MapLocation 
              key={s.id}
              number={i+1}
              {...s.properties}
              color={colors[i]}
              onLocationClick={() => navigateToLocation(s)}
              onDismissClick={() => removeLocation(s)}
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
  colors: PropTypes.array
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
  navigateToLocation: (feature) => {
    const l = parseLocationsString(
      getLocationFromFeature(feature)
    )[0];
    if (l) {
      dispatch(onViewportChange({ 
        latitude: parseFloat(l.latitude), 
        longitude: parseFloat(l.longitude),
        zoom: l.id.length + 2
      }, true))
    }
  }
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(MapSelectedLocations)


