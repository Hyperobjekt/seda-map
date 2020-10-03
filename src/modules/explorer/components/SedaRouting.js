import React from 'react'
import PropTypes from 'prop-types'
import useRouting from '../hooks/useRouting'

/** Null component that uses the routing hook to update the hash */
const SedaRouting = () => {
  useRouting()
  return null
}
export default SedaRouting
