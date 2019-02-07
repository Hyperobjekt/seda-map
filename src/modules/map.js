const initialState = {
  metric: 'ach',
  region: 'districts',
  demographic: 'mn',
  hoveredFeature: null,
  viewport: {
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
  },
  selected: []
}

const map = (state = initialState, action) => {
  switch(action.type) {
    case 'SET_HOVERED_FEATURE':
      return {
        ...state,
        hoveredFeature: action.hoveredFeature
      }
    case 'SET_MAP_REGION':
      return {
        ...state,
        region: action.region
      }
    case 'SET_MAP_DEMOGRAPHIC':
      return {
        ...state,
        demographic: action.demographic
      }
    case 'SET_MAP_METRIC':
      return {
        ...state,
        metric: action.metric
      }
    case 'ADD_SELECTED_FEATURE':
      return {
        ...state,
        selected: [ 
          ...state.selected, 
          action.feature
        ]
      }
    case 'SET_MAP_VIEWPORT':
      return {
        ...state,
        viewport: { 
          ...state.viewport,
          ...action.viewport 
        }
      }
    default:
      return state;
  }
}

export default map;