import { useUiStore } from '../../app/hooks'
import shallow from 'zustand/shallow'

/**
 * Provides embed dialog visible value and toggle function
 * @returns {[boolean, Function]} [ showEmbedDialog, toggleEmbedDialog ]
 */
export default function useEmbedDialogVisibility() {
  return useUiStore(
    state => [state.showEmbedDialog, state.toggleEmbedDialog],
    shallow
  )
}
