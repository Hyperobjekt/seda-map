import create from 'zustand'

const [useCompareStore] = create((set, get) => ({
  dialogOpen: false,
  setDialogOpen: (dialogOpen) => set({dialogOpen})
}))

export default useCompareStore