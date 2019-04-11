import React from 'react'
import PropTypes from 'prop-types';
import Hint from '../base/Hint';
import MapSearch from '../map/MapSearch';
import { Typography } from '@material-ui/core';
import { getLang, splitLang } from '../../constants/lang';


const assembleTextAndComponents = (text, components) => {
  const arr = splitLang(text);
  return arr.map((a,i) => {
    if (a && a[0] !== '$') {
      return <span key={'intro-'+i}>{a}</span>
    } else {
      a = a.replace('$[', '')
      a = a.replace(']', '')
      if (components[a]) {
        return components[a]
      }
      return a;
    }
  })
}

const getIntroText = () => {
  const params = {
    avg: <Hint key='intro-avg' text={getLang('EXPLAINER_AVG')}>
        {getLang('LABEL_AVG')}
      </Hint>,
    grd: <Hint key='intro-grd' text={getLang('EXPLAINER_GRD')}>
      {getLang('LABEL_GRD')}
      </Hint>,
    coh: <Hint key='intro-coh' text={getLang('EXPLAINER_COH')}>
      {getLang('LABEL_COH')}
    </Hint>
  };
  return assembleTextAndComponents(
    getLang('INTRO_DESCRIPTION'), params
  );
}

function MapIntro({onSearchSelect}) {
  return (
    <div className="section section--intro ">
      <img 
        className="section__image"
        alt={getLang('LOGO_ALT_TEXT')}
        src="/assets/img/seda-light.svg"
      />
      <div className="section__header">
        <Typography 
          variant="h5" 
          component="div" 
          className="section__heading"
        >
          <span>
            { getLang('INTRO_TITLE')}
          </span> 
          <MapSearch
            onSuggestionSelected={onSearchSelect}
          />
        </Typography>
        <Typography component="div" className="section__description">
          { getIntroText().map(c => c) }
        </Typography>
      </div>
      
    </div>
  )
}

MapIntro.propTypes = {
  onSearchSelect: PropTypes.func
}

export default MapIntro

