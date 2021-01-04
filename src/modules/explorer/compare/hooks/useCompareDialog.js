import shallow from 'zustand/shallow'
import useCompareStore from './useCompareStore'

export default function useCompareDialog() {
  return useCompareStore(
    state => [state.dialogOpen, state.setDialogOpen],
    shallow
  )
}
