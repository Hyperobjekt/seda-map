import React from 'react'
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Select from '../base/Select';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { updateRoute } from '../../modules/router';
import { getMetrics, getRegions, getDemographics } from '../../modules/config';

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
        <Grid xs={12} md={4} item>
          <Select
            fullWidth
            label="Data Metric"
            value={ metric }
            items={ getMetrics() }
            onChange={ onMetricChange }
          />
        </Grid>
        <Grid xs={12} md={4} item>
          <Select
            fullWidth
            label="Region"
            value={ region }
            items={ getRegions() }
            onChange={ onRegionChange }
          />
        </Grid>
        <Grid xs={12} md={4} item>
          <Select
            fullWidth
            label="Demographic"
            value={ demographic }
            items={ getDemographics() }
            onChange={ onDemographicChange }
          />
        </Grid>
      </Grid>
    </div>
  </div>
);

MapControls.propTypes = {
  metrics: PropTypes.array,
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