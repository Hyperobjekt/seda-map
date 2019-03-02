import React from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import ReportCardSummary from './ReportCardSummary';

const ReportCard = ({ onClose, data, metricItems, demographic, onDemographicChange }) => {
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
            metricItems={metricItems}
            vars={[ 'avg', 'grd', 'coh' ]}
            demographic={demographic}
            onDemographicChange={onDemographicChange}
          />
      </div>
    </div>
  )
}

ReportCard.propTypes = {
  data: PropTypes.object,
  onClose: PropTypes.func,
}

export default ReportCard
