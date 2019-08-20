const initialState = {
  menuOpen: false,
  helpOpen: false,
  embedOpen: false,
  statsViewActive: false,
  helpTab: 0,
  legendType: 'chart',
  shareLinkOpen: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_MENU':
      return { ...state, menuOpen: action.open }
    case 'TOGGLE_HELP':
      return { ...state, helpOpen: action.open }
    case 'SET_HELP_TAB':
      return { ...state, helpTab: action.tab }
    case 'TOGGLE_STATS_VIEW':
      return { ...state, statsViewActive: action.active }
    case 'TOGGLE_LEGEND_TYPE':
      return { 
        ...state, 
        legendType: state.legendType === 'chart' ? 'condensed' : 'chart'
      }
    case 'SET_EMBED_DIALOG':
      return { ...state, embedOpen: action.open }
    case 'SET_LINK_DIALOG':
      return { ...state, shareLinkOpen: action.open }
    default:
      return state
  }
}
