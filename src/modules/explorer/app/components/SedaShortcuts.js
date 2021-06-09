import { useEffect } from 'react'
import { useKeyPress } from '../../../../shared'
import { useHelpVisibility } from '../../help'
import { useTogglePanel } from '../../panels'

/**
 * TODO: keyboard shortcuts
 * @param {*} props
 */
const SedaShortcuts = () => {
  const togglePanel = useTogglePanel()
  // help panel shortcut
  const helpPress = useKeyPress('?')
  const [, toggleHelp] = useHelpVisibility()
  useEffect(() => {
    helpPress && toggleHelp()
  }, [helpPress, toggleHelp])
  // metric panel shortcut
  const metricPress = useKeyPress('m')
  useEffect(() => {
    metricPress && togglePanel('metric')
  }, [metricPress, togglePanel])
  // region panel shortcut
  const regionPress = useKeyPress('r')
  useEffect(() => {
    regionPress && togglePanel('region')
  }, [regionPress, togglePanel])
  // subgroup panel shortcut
  const subgroupPress = useKeyPress('g')
  useEffect(() => {
    subgroupPress && togglePanel('demographic')
  }, [subgroupPress, togglePanel])
  // filter panel shortcut
  const filterPress = useKeyPress('f')
  useEffect(() => {
    filterPress && togglePanel('filter')
  }, [filterPress, togglePanel])
  // location list panel shortcut
  const locationPress = useKeyPress('l')
  useEffect(() => {
    locationPress && togglePanel('location')
  }, [locationPress, togglePanel])
  return null
}

SedaShortcuts.propTypes = {}

export default SedaShortcuts
