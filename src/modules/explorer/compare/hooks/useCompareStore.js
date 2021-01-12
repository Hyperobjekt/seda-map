import create from 'zustand'

/**
 * Comparison store that mimics functionality in `useDataOptions`.
 * Options are kept separately here for comparison view, so that
 * the map and chart are not re-rendered while making changes in
 * compare view
 */
const [useCompareStore] = create((set, get) => ({
  // dialog visibility state
  dialogOpen: true,
  setDialogOpen: dialogOpen => set({ dialogOpen }),
  // stores metric for comparison (separate from explorer metric so map / chart doesn't re-render)
  metric: 'avg',
  setMetric: metric => set({ metric }),
  // stores demographic for comparison (separate from explorer metric so map / chart doesn't re-render)
  demographic: 'all',
  setDemographic: demographic => set({ demographic }),
  // stores the currently selected compare location
  selectedLocation: null,
  setSelectedLocation: selectedLocation => {
    set({ selectedLocation })
  },
  // stores locations active in the comparison dialog
  locations: [],
  setLocations: locations => set({ locations }),
  addLocations: locations =>
    set({ locations: [...get().locations, ...locations] }),
  // expose setter for setting multiple things
  setCompareStore: set
}))

export default useCompareStore
