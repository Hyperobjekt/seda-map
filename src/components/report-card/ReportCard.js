import React from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import ReportCardSummary from './ReportCardSummary';
import { updateRoute } from '../../modules/router';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const ReportCard = ({
  onClose, 
  data, 
  demographic, 
  onDemographicChange
}) => {
  return (
    <div className="report-card">
      <div className="report-card__header">
        <Typography variant="h6">
          {data.name}
        </Typography>
        <IconButton 
          size="small"
          classes={
            {root: 'report-card__close-button'}
          }
          aria-label="Close Report Card"
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div className="report-card__body">
          <ReportCardSummary 
            data={data} 
            vars={[ 
              { id: 'avg', label: 'Average Test Scores' },
              { id: 'grd', label: 'Growth Over Years' },
              { id: 'coh', label: 'Trend Over Years' },
              { id: 'ses', label: 'Socioeconomic Status' },
            ]}
            demographic={demographic}
            onDemographicChange={onDemographicChange}
          />
          <div className="report-card-section">
            <Typography classes={{root: "report-card-section__heading" }}>
              Socioeconomic Conditions
            </Typography>
            <div className="report-card-section__body">
              <Typography variant="body2">
                This section will show how the socioeconomic conditions for {data.name} compares to other areas. By default, it shows how average test scores correlate to socioeconomic status in the scatterplot. The scatterplot also allows the user to select any of the three key data metrics to see how they correlate to socioeconomic conditions.
              </Typography>
            </div>
          </div>
          <div className="report-card-section">
            <Typography classes={{root: "report-card-section__heading" }}>
              Opportunity Differences
            </Typography>
            <div className="report-card-section__body">
              <Typography variant="body2">
                This section will show how opportunity differs among subgroups within {data.name}. By default, it will show achievement compared between poor and non-poor students. The scatterplot also allows the user to select any of the three key data metrics along with a list of subgroups to compare.
              </Typography>
            </div>
          </div>
          <div className="report-card-section">
            <Typography classes={{root: "report-card-section__heading" }}>
              Achievement Gaps
            </Typography>
            <div className="report-card-section__body">
              <Typography variant="body2">
                This section will show how achievement gaps are associated with other variables like socioeconomic status or segregation. By default, it shows white / black achievement gap by white / black socioeconomic status gap. The scatterplot also allows the user to select the type of achievement gap and comparison variable. 
              </Typography>
            </div>
          </div>
          <div className="report-card-section">
            <Typography classes={{root: "report-card-section__heading" }}>
              Similar Places
            </Typography>
            <div className="report-card-section__body">
              <Typography variant="body2">
                This section will show similar places based on size, socioeconomic status, and racial composition.
              </Typography>
            </div>
          </div>
      </div>
    </div>
  )
}

ReportCard.propTypes = {
  data: PropTypes.object,
  onClose: PropTypes.func,
  demographic: PropTypes.string, 
  onDemographicChange: PropTypes.func
}

const mapStateToProps = (
  { reportCard, features },
  { match: { params: { demographic } } }
) => ({
  data: reportCard && features[reportCard] ?
    features[reportCard].properties :
    {}
  ,
  demographic
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDemographicChange: (value) => 
    updateRoute(ownProps, { demographic: value })
})

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(ReportCard)