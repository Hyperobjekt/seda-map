import React from "react"
import PropTypes from "prop-types"

/** Prints any provided props */
const DataDump = props => {
  const str = JSON.stringify(props, null, 2)
  return <pre>{str}</pre>
}

DataDump.propTypes = {}

export default DataDump
