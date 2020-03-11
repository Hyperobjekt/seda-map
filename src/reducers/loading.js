const initialState = [ 'map', 'scatterplot', 'flagged' ]

const loading = (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_FLAGGED_SUCCESS':
      return state.filter((id) => id !== 'flagged')
    case 'LOAD_MAP_SUCCESS':
      return state.filter((id) => id !== 'map')
    case 'LOAD_SCATTERPLOT_SUCCESS':
      return state.filter((id) => id !== 'scatterplot')
    default:
      return state;
  }
}

export default loading;
