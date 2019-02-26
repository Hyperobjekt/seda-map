import React from 'react'
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Select from '../base/Select';
import { metrics, regions, demographics } from '../../constants/dataOptions';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { updateRoute } from '../../modules/router';

const MapControls = ({ 
  metric, 
  region, 
  demographic,  
  onMetricChange, 
  onRegionChange, 
  onDemographicChange 
}) => (
  <div className="map-controls">
    <div className="map-controls__container">
      <Grid spacing={16} container>
        <Grid xs={12} lg={4} item>
          <Select
            fullWidth
            label="Data Metric"
            value={ metric }
            items={ metrics }
            onChange={ onMetricChange }
          />
        </Grid>
        <Grid xs={12} lg={4} item>
          <Select
            fullWidth
            label="Region"
            value={ region }
            items={ regions }
            onChange={ onRegionChange }
          />
        </Grid>
        <Grid xs={12} lg={4} item>
          <Select
            fullWidth
            label="Demographic"
            value={ demographic }
            items={ demographics }
            onChange={ onDemographicChange }
          />
        </Grid>
      </Grid>
    </div>
  </div>
);

MapControls.propTypes = {
  metric: PropTypes.string,
  demographic: PropTypes.string,
  region: PropTypes.string,
  onMetricChange: PropTypes.func, 
  onRegionChange: PropTypes.func, 
  onDemographicChange: PropTypes.func
}

const mapStateToProps = (state, { match: { params } }) => params

const mapDispatchToProps = (dispatch, ownProps) => ({
  onMetricChange: (value) => updateRoute(ownProps, { metric: value }),
  onRegionChange: (value) => updateRoute(ownProps, { region: value }),
  onDemographicChange: (value) => updateRoute(ownProps, { demographic: value }),
})

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(MapControls);