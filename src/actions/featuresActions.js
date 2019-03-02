import { loadFeaturesFromRoute, loadFeatureFromCoords } from "../utils/tilequery";
import { addFeatureToRoute } from '../modules/router';

const onLoadFeaturesRequest = (locations) => ({
  type: 'LOAD_FEATURES_REQUEST',
  locations
});

const onLoadFeaturesSuccess = (features) => ({
  type: 'LOAD_FEATURES_SUCCESS',
  features
})

const onLoadFeaturesError = (error) => ({
  type: 'LOAD_FEATURES_ERROR',
  error
})

export const loadLocation = (location) =>
  (dispatch, getState) => {
    const pathname = getState().router.location.pathname;
    dispatch(onLoadFeaturesRequest([location]))
    loadFeatureFromCoords(location)
      .then(feature => {
        dispatch(onLoadFeaturesSuccess([feature]))
        dispatch(addFeatureToRoute(dispatch, pathname, feature))
      })
      .catch((error) => {
        console.error(error)
        dispatch(onLoadFeaturesError(error))
      })
    }

export const loadRouteLocations = (locations) => 
  (dispatch) => {
    dispatch(onLoadFeaturesRequest(locations))
    loadFeaturesFromRoute(locations)
      .then(features => {
        dispatch(onLoadFeaturesSuccess(features))
      })
      .catch((error) => {
        console.error(error)
        dispatch(onLoadFeaturesError(error))
      })
  }