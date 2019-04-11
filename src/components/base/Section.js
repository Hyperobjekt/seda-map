import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography';
import MapLocationCards from '../map/MapLocationCards';
import MapSearch from '../map/MapSearch';
import MenuSentence from '../base/MenuSentence';
import { getLang } from '../../constants/lang';

function Section({ 
  id, 
  type,
  title, 
  description,
  headerMenu,
  cardMetrics,
  selected,
  children,
  onOptionChange, 
}) {
  return (
    <div id={id} name={id} className={"section section--" + (type || id)}>
      <div className="section__header">
        {
          typeof(title) === 'string' ?
            <Typography 
              variant="h5" 
              component="div" 
              className="section__heading"
            >
              {title}
            </Typography>
            :
            <MenuSentence
              className="section__heading"
              variant="h5"
              onChange={onOptionChange}
              {...title}
            />
        }
        
        <Typography 
          component="div" 
          className="section__description"
        >
          {description}
        </Typography>
      </div>

      <div className="section__body">
      
        <div className="section__places">
          <MapLocationCards 
            section={id}
            metrics={cardMetrics}
          >
            <div className="location-card location-card--search">
              <Typography component="p" className="helper helper--card-search">
                { getLang('CARD_SEARCH_HELPER') }
              </Typography>
            </div>
          </MapLocationCards>
        </div>

        {/* Hack approach to overlay search on top of visualization */}
        <div className="section__places section__places--overlay">
          <div className="location-card-list">
            {
              Boolean(selected) && Boolean(selected.length) && 
                [...Array(selected.length)].map((_, i) =>
                  <div key={'pchld-'+i} className="location-card"></div>
                )
            }
            <div className="location-card location-card--search">
              <MapSearch
                inputProps={{
                  placeholder: getLang('CARD_SEARCH_PLACEHOLDER')
                }}
              />
            </div>
          </div>
        </div>

        <div className="section__component">

          <div className="section__controls">
            <MenuSentence 
              {...headerMenu}
              onChange={onOptionChange}
            />
          </div>
          { children }
        </div>
      </div>
    </div>
  )
}

Section.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  title: PropTypes.any,
  description: PropTypes.string,
  selected: PropTypes.array,
  cardMetrics: PropTypes.array,
  children: PropTypes.node,
  headerMenu: PropTypes.shape({
    text: PropTypes.string,
    controls: PropTypes.array,
  }),
  onOptionChange: PropTypes.func,
}

export default Section

