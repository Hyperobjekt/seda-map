const initialState = {
  'sped': [],
  'lep': [],
  'gifted': []
}

const flagged = (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_FLAGGED_SUCCESS':
      return {
        ...state,
        [action.flag]: action.ids
      }
    default:
      return state;
  }
}

export default flagged;
