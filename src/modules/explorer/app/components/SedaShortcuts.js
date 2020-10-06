import { useEffect } from 'react'
import { useKeyPress } from '../../../../shared'
import { useHelpVisibility } from '../../help'

/**
 * TODO: keyboard shortcuts
 * @param {*} props
 */
const SedaShortcuts = props => {
  const helpPress = useKeyPress('?')
  const [, toggleHelp] = useHelpVisibility()
  useEffect(() => {
    helpPress && toggleHelp()
  }, [helpPress, toggleHelp])
  return null
}

SedaShortcuts.propTypes = {}

export default SedaShortcuts
