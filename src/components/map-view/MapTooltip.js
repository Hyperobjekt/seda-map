import { connect } from 'react-redux';
import Tooltip from '../base/Tooltip';
import { getChoroplethProperty } from '../../modules/map';
import { getMetricShortLabel } from '../../modules/metrics';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

const getValues = (feature, vals) =>
  feature ? vals.map(v => {
    return [
      v[0],
      feature.properties[v[1]] &&
      feature.properties[v[1]] > -9999 ?
        Math.round(feature.properties[v[1]]*100)/100 :
        'Unavailable'
    ]
  }) : []

const getFeatureName = (feature, results = {}) => {
  if (
    feature && 
    feature.properties && 
    feature.properties.name
  ) {
    return feature.properties.name
  }
  if (
    feature &&
    feature.properties &&
    feature.properties.id &&
    results[feature.properties.id]
  ) {
    return results[feature.properties.id].name
  }
  return null;
}

const mapStateToProps = ({ 
  hovered: { feature, coords: { x, y } },
  metrics,
  search: { results }
}, {
  match: { params }
}) => ({
  x,
  y,
  visible: Boolean(feature),
  title: getFeatureName(feature, results),
  values: getValues(feature, [ [
    getMetricShortLabel(metrics, params.metric),
    getChoroplethProperty(params)
  ] ])
})

const MapTooltip = compose(
  withRouter,
  connect(mapStateToProps, null)
)(Tooltip)

export default MapTooltip