import React from 'react'
import { demographics } from '../../constants/dataOptions';
import Select from '../base/Select';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


const ReportCardSummary = ({
  data, 
  vars,  
  demographic,
  onDemographicChange
}) => {
  return (
    <div className="report-card__summary">      
      <List>
        <ListItem>
          <Select
            fullWidth
            label="Showing data for demographic:"
            value={ demographic }
            items={ demographics }
            onChange={onDemographicChange}
          />
        </ListItem>
        {vars && vars.map((v,i) => 
          <ListItem key={"rcs-"+i}>
            <ListItemText 
              primary={
                (data[demographic+'_'+v.id] && data[demographic+'_'+v.id]) > -9999 ?
                (Math.round(data[demographic+'_'+v.id] * 100) / 100) :
                'Unavailable'
              }
              secondary={v.label}
            />
          </ListItem>
        )}
      </List>
    </div>
  )
}

export default ReportCardSummary
