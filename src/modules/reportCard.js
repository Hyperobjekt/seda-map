const reportCard = (state = false, action) => {
  switch(action.type) {
    case 'SHOW_REPORT_CARD':
      return action.id
    case 'HIDE_REPORT_CARD':
      return false
    default:
      return state
  }
}

export default reportCard;