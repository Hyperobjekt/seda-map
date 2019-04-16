import React from 'react'
import PropTypes from 'prop-types';
import Hint from '../base/Hint';
import { Typography, Button } from '@material-ui/core';
import { getLang } from '../../constants/lang';
import Card from '../base/Card';


// TODO: re-implement lang for the intro section if we use
// the card components

// const assembleTextAndComponents = (text, components) => {
//   const arr = splitLang(text);
//   return arr.map((a,i) => {
//     if (a && a[0] !== '$') {
//       return <span key={'intro-'+i}>{a}</span>
//     } else {
//       a = a.replace('$[', '')
//       a = a.replace(']', '')
//       if (components[a]) {
//         return components[a]
//       }
//       return a;
//     }
//   })
// }

// const getIntroText = () => {
//   const params = {
//     avg: <Hint key='intro-avg' text={getLang('EXPLAINER_AVG')}>
//         {getLang('LABEL_AVG')}
//       </Hint>,
//     grd: <Hint key='intro-grd' text={getLang('EXPLAINER_GRD')}>
//       {getLang('LABEL_GRD')}
//       </Hint>,
//     coh: <Hint key='intro-coh' text={getLang('EXPLAINER_COH')}>
//       {getLang('LABEL_COH')}
//     </Hint>
//   };
//   return assembleTextAndComponents(
//     getLang('INTRO_DESCRIPTION'), params
//   );
// }

function MapIntro() {
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
        {/* <Typography component="div" className="section__description">
          { getIntroText().map(c => c) }
        </Typography> */}
      </div>
      <div className="section__cards">
          <Card
            dark={true}
            title="Educational Opportunity"
          >
            <Typography paragraph={true} className="card__text">
              Explore educational opportunity within communities by comparing 
              {' '}<Hint key='intro-avg' text={getLang('EXPLAINER_AVG')}>{getLang('LABEL_AVG')}</Hint> 
              {' '}to socioeconomic status and poverty measures.
            </Typography>
            <Button variant="contained" color="secondary">Show Educational Opportunity</Button>
          </Card>
          <Card 
            title="School Quality"
            dark={true}
          >
            <Typography paragraph={true} className="card__text">
              Explore the quality of education for schools and communities by viewing 
              {' '}<Hint key='intro-grd' text={getLang('EXPLAINER_GRD')}>{getLang('LABEL_GRD')}</Hint> 
              {' '}that show how much students are learning each year.
            </Typography>
            <Button variant="contained" color="secondary">Show School Quality</Button>
          </Card>
          <Card 
            title="Changes in Opportunity"
            dark={true}
          >
            <Typography paragraph={true} className="card__text">
              Explore how opportunity is changing over time in your community by viewing the 
              {' '}<Hint key='intro-coh' text={getLang('EXPLAINER_COH')}>{getLang('LABEL_COH')}</Hint> 
              {' '}over time.
            </Typography>
            <Button 
              variant="contained" 
              color="secondary"
              classes={{ root: 'card__button' }}
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
  onSearchSelect: PropTypes.func
}

export default MapIntro

