const initialState = []

export default (state = initialState, { type, topicId }) => {
  switch (type) {
    case 'SHOW_HELP_TOPIC':
      return [ ...state, topicId ]
    case 'HIDE_HELP_TOPIC':
      return state.filter((t) => t !== topicId)
    case 'SHOW_SINGLE_TOPIC':
      return [ topicId ]
    default:
      return state
  }
}
