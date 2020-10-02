import shallow from 'zustand/shallow'
import { useUiStore } from '../../app/hooks'

/**
 * Provides link dialog visible value and toggle function
 * @returns {[boolean, Function]} [ showLinkDialog, toggleLinkDialog ]
 */
export default function useLinkDialogVisibility() {
  return useUiStore(
    state => [state.showLinkDialog, state.toggleLinkDialog],
    shallow
  )
}
