import React from 'react'
import { InstantSearch, SearchBox, Hits, Highlight, Configure, connectSearchBox } from 'react-instantsearch-dom';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import { onViewportChange, onRegionChange } from '../../actions/mapActions';
import {FlyToInterpolator} from 'react-map-gl';
import * as ease from 'd3-ease';
import { loadLocation } from '../../actions/featuresActions';

const algolia = {
  id: process.env.REACT_APP_ALGOLIA_ID,
  key: process.env.REACT_APP_ALGOLIA_KEY,
  index: process.env.REACT_APP_ALGOLIA_INDEX
}

const SearchMenuItem = 
  ({hit, onClick}) => {
    return (
      <MenuItem component='div' onClick={() => onClick(hit)}>
        <span className="hit-name">
          <Highlight attribute="name" hit={hit} />
        </span>
      </MenuItem>
    );
  }

const Results = connectSearchBox(
  ({ currentRefinement, refine, onClick }) =>
    currentRefinement ? (
      <Hits hitComponent={ (hit) => <SearchMenuItem hit={hit.hit} onClick={e => { refine(''); onClick(e)}} /> } />
    ) : //<div>No query</div>
    null
);

const mapDispatchToProps = (dispatch) => ({
  selectSearchResult: (hit) => {
    if (hit) {
      dispatch(onViewportChange({ 
        latitude: parseFloat(hit.lat), 
        longitude: parseFloat(hit.lon),
        zoom: hit.id.length,
        transitionDuration: 3000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: ease.easeCubic
      }))
      const region = hit.group === 'districts' ?
        'districts' : hit.group === 'counties' ?
        'counties' : 'schools';
      dispatch(onRegionChange(region))
      dispatch(loadLocation({ 
        id: hit.id,
        lat: hit.lat,
        lon: hit.lon
      }))
    }
  }
})

const Search = connect(null, mapDispatchToProps)(
  ({ selectSearchResult }) => {
    return (
      <div>
        <SearchBox />
        <Results onClick={(e) => {
          selectSearchResult(e);
        }} />
      </div>
    );
  }
);

const MapSearch = () => {
  return (
    <div className="map-search-wrapper">
      <InstantSearch
        appId={algolia.id}
        apiKey={algolia.key}
        indexName={algolia.index}
      >
        <Configure hitsPerPage={5} />
        <Search />
      </InstantSearch>
    </div>
  )
}

export default MapSearch


