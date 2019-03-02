import {FlyToInterpolator} from 'react-map-gl';
// 3rd-party easing functions
import * as ease from 'd3-ease';
import { addFeatureToRoute, removeFeatureFromRoute, updateRegionInRoute } from '../modules/router';

export const onHoverFeature = (feature) => ({
  type: 'SET_HOVERED_FEATURE',
  feature
});

export const onCoordsChange = (coords) => ({
  type: 'SET_COORDS',
  coords
});

export const showReportCard = (id) => ({
  type: 'SHOW_REPORT_CARD',
  id
});

export const hideReportCard = () => ({
  type: 'HIDE_REPORT_CARD'
});

export const onViewportChange = (viewport, transition = false) => {
  if (transition) {
    viewport = { 
      ...viewport,
      transitionDuration: 3000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: ease.easeCubic
    }
  }
  return ({
    type: 'SET_MAP_VIEWPORT',
    viewport
  });
}

export const onDemographicChange = (demographic) => ({
  type: 'SET_MAP_DEMOGRAPHIC',
  demographic
});

export const onMetricChange = (metric) => ({
  type: 'SET_MAP_METRIC',
  metric
});

export const onRegionChange = (region) => 
  (dispatch, getState) =>
    updateRegionInRoute(
      dispatch, 
      getState().router.location.pathname, 
      region
    )

export const onSelectFeature = (feature, region) => 
  (dispatch, getState) => {
    dispatch({
      type: 'ADD_SELECTED_FEATURE',
      feature,
      region
    });
    addFeatureToRoute(dispatch, getState().router.location.pathname, feature)
  }


export const onRemoveSelectedFeature = (feature) => 
  (dispatch, getState) => {
    dispatch({
      type: 'REMOVE_SELECTED_FEATURE',
      feature
    });
    removeFeatureFromRoute(dispatch, getState().router.location.pathname, feature)
  }