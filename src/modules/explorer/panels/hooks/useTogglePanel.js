import { useCallback } from 'react'
import useActivePanel from './useActivePanel'

/**
 * Provides a callback function that toggles a provided panel id on or off based on current status
 */
export default function useTogglePanel() {
  const [activePanel, setActivePanel] = useActivePanel()
  return useCallback(
    panelId => {
      activePanel === panelId
        ? setActivePanel(null)
        : setActivePanel(panelId)
    },
    [activePanel, setActivePanel]
  )
}
