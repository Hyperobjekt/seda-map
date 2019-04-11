import { connect } from 'react-redux';
import Tooltip from '../base/Tooltip';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { getStateName } from '../../constants/statesFips';
import { getTooltipText } from '../../style/scatterplot-style';

/**
 * Gets the location name for the title of the tooltip
 * @param {*} feature 
 */
const getFeatureTitle = (feature) => {
  if (
    feature && 
    feature.properties && 
    feature.properties.name
  ) {
    return feature.properties.name + ', '
      + getStateName(feature.properties.id)
  }
  return null;
}

const mapStateToProps = ({ 
  map: { coords, viewport },
  sections: { map: { hovered } }
}, {
  match: { params: { metric, demographic } }
}) => {
  const varName = [demographic, metric].join('_')
  return {
    x: coords && coords.x,
    y: coords && coords.y,
    visible: Boolean(hovered) && coords && coords.x && coords.y,
    title: getFeatureTitle(hovered),
    content: hovered && hovered.properties && hovered.properties[varName] ? 
      getTooltipText({
        [varName]: hovered.properties[varName]
      }) : '',
    above: viewport && viewport.height && 
      coords && coords.y > (viewport.height / 1.25),
    left: viewport && viewport.width && 
      coords && coords.x > (viewport.width / 1.5) 
  }
}

const MapTooltip = compose(
  withRouter,
  connect(mapStateToProps, null)
)(Tooltip)

export default MapTooltip