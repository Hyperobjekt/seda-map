import create from 'zustand'

const [useUiStore] = create(set => ({
  // current view of the data
  view: 'map',
  setView: view => set({ view }),
  // currently hovered id
  hovered: null,
  setHovered: (hoveredId, coords) =>
    hoveredId
      ? set(state => ({
          hovered: hoveredId,
          coords: coords ? coords : state.coords,
          showTooltip: true
        }))
      : set({ showTooltip: false }),
  // x, y coords of tooltip
  coords: [0, 0],
  setCoords: coords => set({ coords }),
  // boolean determining tooltip visibility
  showTooltip: false,
  setShowTooltip: showTooltip => set({ showTooltip }),
  // boolean determining if menu is open
  showMenu: false,
  toggleMenu: () =>
    set(state => ({ showMenu: !state.showMenu })),
  // boolean determining if help is open
  showHelp: false,
  toggleHelp: () =>
    set(state => ({ showHelp: !state.showHelp })),
  // boolean determining is preview chart is visible
  showChart: true,
  setShowChart: showChart => set({ showChart }),
  toggleChart: () =>
    set(state => ({ showChart: !state.showChart })),
  // boolean determining if controls are condensed
  condensed: false,
  toggleCondensed: () =>
    set(state => ({ condensed: !state.condensed })),
  // active location
  activeLocation: null,
  setActiveLocation: activeLocation => set({ activeLocation }),
  // string determining which selection is currently active
  selection: null,
  setSelection: selection => set({ selection })
}))

export default useUiStore
