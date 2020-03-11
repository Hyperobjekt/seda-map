const features = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_SELECTED_FEATURE':
      return {
        ...state,
        [action.feature.properties.id]: action.feature
      }
    case 'LOAD_FEATURES_SUCCESS':
      return {
        ...state,
        ...action.features.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.properties.id]: curr
          }),
          {}
        )
      }
    default:
      return state
  }
}

export default features
