import { fromJS } from 'immutable'

/**
 * Sources used in the map style. These are custom tilesets generated in the SEDA ETL pipeline (https://github.com/Hyperobjekt/seda-etl/)
 */
export const SEDA_SOURCES = fromJS({
  seda: {
    url:
      'mapbox://hyperobjekt.states-v4-' +
      process.env.REACT_APP_BUILD_ID +
      ',hyperobjekt.counties-v4-' +
      process.env.REACT_APP_BUILD_ID +
      ',hyperobjekt.districts-v4-' +
      process.env.REACT_APP_BUILD_ID +
      ',hyperobjekt.schools-v4-' +
      process.env.REACT_APP_BUILD_ID,
    type: 'vector'
  }
})
