import React from 'react'
import PropTypes from 'prop-types'
import { Typography, Button } from '@material-ui/core'
import { getLang } from '../../shared/selectors/lang'
import Card from '../molecules/Card'

function MapIntro({ onMeasureClick }) {
  return (
    <div className="section section--intro ">
      <img
        className="section__image"
        alt={getLang('LOGO_ALT_TEXT')}
        src="/assets/img/seda-dark.svg"
      />
      <div className="section__header">
        <Typography component="p" className="section__description">
          {getLang('INTRO_DESCRIPTION')}
        </Typography>
        <Typography variant="h5" component="div" className="section__heading">
          {getLang('INTRO_TITLE')}
        </Typography>
      </div>
      <div className="section__cards">
        <Card dark={true} title={getLang('LABEL_CONCEPT_AVG')}>
          <Typography paragraph={true} className="card__text">
            {getLang('INTRO_CARD_DESCRIPTION_AVG')}
          </Typography>
          <Button
            onClick={() => onMeasureClick('avg')}
            variant="contained"
            color="secondary"
            classes={{ root: 'card__button' }}>
            Go
          </Button>
        </Card>
        <Card title={getLang('LABEL_CONCEPT_GRD')} dark={true}>
          <Typography paragraph={true} className="card__text">
            {getLang('INTRO_CARD_DESCRIPTION_GRD')}
          </Typography>
          <Button
            onClick={() => onMeasureClick('grd')}
            variant="contained"
            color="secondary"
            classes={{ root: 'card__button' }}>
            Go
          </Button>
        </Card>
        <Card title={getLang('LABEL_CONCEPT_COH')} dark={true}>
          <Typography paragraph={true} className="card__text">
            {getLang('INTRO_CARD_DESCRIPTION_COH')}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => onMeasureClick('coh')}
            classes={{ root: 'card__button' }}>
            Go
          </Button>
        </Card>
      </div>
    </div>
  )
}

MapIntro.propTypes = {
  onMeasureClick: PropTypes.func
}

export default MapIntro
