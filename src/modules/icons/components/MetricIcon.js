import React from "react"
import PropTypes from "prop-types"
import ScoresIcon from "./ScoresIcon"
import RatesIcon from "./RatesIcon"
import TrendsIcon from "./TrendsIcon"

const MetricIcon = ({ metricId, ...props }) => {
  switch (metricId) {
    case "avg":
      return <ScoresIcon {...props} />
    case "grd":
      return <RatesIcon {...props} />
    case "coh":
      return <TrendsIcon {...props} />
    default:
      return null
  }
}

MetricIcon.propTypes = {
  /** The metric identifier for the icon */
  metricId: PropTypes.string,
}
MetricIcon.defaultProps = {
  metricId: "avg",
}

export default MetricIcon
