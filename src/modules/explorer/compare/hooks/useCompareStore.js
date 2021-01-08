import create from 'zustand'

const [useCompareStore] = create((set, get) => ({
  // dialog visibility state
  dialogOpen: false,
  setDialogOpen: dialogOpen => set({ dialogOpen }),
  // stores metric for comparison (separate from explorer metric so map / chart doesn't re-render)
  metric: 'avg',
  setMetric: metric => set({ metric }),
  // stores demographic for comparison (separate from explorer metric so map / chart doesn't re-render)
  demographic: 'all',
  setDemographic: demographic => set({ demographic }),
  // stores the currently selected compare location
  selectedLocation: null,
  setSelectedLocation: selectedLocation =>
    set({ selectedLocation }),
  // stores locations active in the comparison dialog
  locations: [],
  setLocations: locations => set({ locations })
}))

export default useCompareStore
