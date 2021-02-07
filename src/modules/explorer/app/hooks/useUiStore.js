import create from 'zustand'
import analyticsMiddleware from '../middleware/analyticsMiddleware'

const useUiStore = create(
  analyticsMiddleware((set) => ({
    // current view of the data
  view: 'map',
  isEmbed: false,
  embedSecondary: false,
  setView: view => set({ view }),
  // currently hovered id
  hovered: null,
  setHovered: (
    hoveredId,
    coords,
    options = { showTooltip: true, showMarkers: true }
  ) =>
    hoveredId
      ? set(state => ({
          hovered: hoveredId,
          coords: coords ? coords : state.coords,
          showTooltip: options.showTooltip,
          showMarkers: options.showMarkers
        }))
      : set({ showTooltip: false, showMarkers: false }),
  // x, y coords of tooltip
  coords: [0, 0],
  setCoords: coords => set({ coords }),
  // boolean determining tooltip visibility
  showTooltip: false,
  setShowTooltip: showTooltip => set({ showTooltip }),
  // boolean determining if markers should be shown for hovered items
  showMarkers: false,
  setShowMarkers: showMarkers => set({ showMarkers }),
  // boolean determining if menu is open
  showMenu: false,
  toggleMenu: () =>
    set(state => ({ showMenu: !state.showMenu })),
  // boolean determining if link dialog is open
  showLinkDialog: false,
  toggleLinkDialog: () =>
    set(state => ({ showLinkDialog: !state.showLinkDialog })),
  // boolean determining if link dialog is open
  showEmbedDialog: false,
  toggleEmbedDialog: () =>
    set(state => ({ showEmbedDialog: !state.showEmbedDialog })),
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
  condensed: true,
  toggleCondensed: () =>
    set(state => ({ condensed: !state.condensed })),

  // string determining which selection is currently active
  selection: null,
  setSelection: selection => {
    set({ selection })
  },
  // string to determine which filter selection is active
  filterPanel: null,
  setFilterPanel: filterPanel => set({ filterPanel }),
  setViewFromRoute: params => {
    set({
      view: params.view,
      isEmbed: !!params.embed,
      embedSecondary: params.secondary.split('+').length > 1
    })
  }
})))

export default useUiStore
