import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import ScatterplotOverlay from './ScatterplotOverlay'

const mapStateToProps = (
  { selected, features, sections: { hovered } },
  {
    match: {
      params: { region }
    }
  }
) => {
  return {
    selected: selected[region],
    region,
    features,
    hovered,
    invertX: region === 'schools'
  }
}

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    null
  )
)(ScatterplotOverlay)
