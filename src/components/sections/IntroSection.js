import React from 'react'
import PropTypes from 'prop-types';
import Hint from '../base/Hint';
import { Typography, Button } from '@material-ui/core';
import { getLangWithComponents, getLang } from '../../constants/lang';
import Card from '../base/Card';

function MapIntro({onMeasureClick}) {
  return (
    <div className="section section--intro ">
      <img 
        className="section__image"
        alt={getLang('LOGO_ALT_TEXT')}
        src="/assets/img/seda-dark.svg"
      />
      <div className="section__header">
        <Typography 
          variant="h5" 
          component="div" 
          className="section__heading"
        >
          { getLang('INTRO_TITLE')}
        </Typography>
      </div>
      <div className="section__cards">
          <Card
            dark={true}
            title={getLang('INTRO_CARD_TITLE_AVG')}
          >
            <Typography paragraph={true} className="card__text">
              {getLangWithComponents('INTRO_CARD_DESCRIPTION_AVG', { 
                avg: <Hint key='intro-avg' text={getLang('EXPLAINER_AVG')}>
                    {getLang('LABEL_AVG')}
                  </Hint>
                })}
            </Typography>
            <Button 
              onClick={() => onMeasureClick('avg')}
              variant="contained" 
              color="secondary"
              classes={{root: 'card__button'}}
            >Show Educational Opportunity</Button>
          </Card>
          <Card 
            title={getLang('INTRO_CARD_TITLE_GRD')}
            dark={true}
          >
            <Typography paragraph={true} className="card__text">
              {getLangWithComponents('INTRO_CARD_DESCRIPTION_GRD', { 
                grd:  
                  <Hint key='intro-grd' text={getLang('EXPLAINER_GRD')}>
                    {getLang('LABEL_GRD')}
                  </Hint>
                })}
            </Typography>
            <Button 
              onClick={() => onMeasureClick('grd')}
              variant="contained" 
              color="secondary"
              classes={{root: 'card__button'}}
            >Show School Quality</Button>
          </Card>
          <Card 
            title={getLang('INTRO_CARD_TITLE_COH')}
            dark={true}
          >
            <Typography paragraph={true} className="card__text">
              {getLangWithComponents('INTRO_CARD_DESCRIPTION_COH', { 
                coh:  
                  <Hint key='intro-coh' text={getLang('EXPLAINER_COH')}>
                    {getLang('LABEL_COH')}
                  </Hint>
                })}
            </Typography>
            <Button 
              variant="contained" 
              color="secondary"
              onClick={() => onMeasureClick('coh')}
              classes={{root: 'card__button'}}
            >Show Opportunity Changes</Button>
          </Card>
      </div>
      <div className="section__footer">
        OR SELECT YOUR OWN OPTIONS ↓
      </div>
      
    </div>
  )
}

MapIntro.propTypes = {
  onMeasureClick: PropTypes.func
}

export default MapIntro

