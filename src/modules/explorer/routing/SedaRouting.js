import React from 'react'
import useRouting from './hooks/useRouting'

/**
 * Null component with hook that handles loading the initial route and pushing updates
 */
export default () => {
  useRouting()
  return null
}
