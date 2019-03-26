import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import Hint from '../../components/base/Hint';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';

import { updateRoute } from '../../modules/router';
import { getRegions, getDemographics, getDemographicById, getMetrics, getMetricById, getRegionById } from '../../modules/config';



class MenuDialog extends Component {
  static propTypes = {
    classes: PropTypes.object,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string,
  };

  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };
  handleListItemClick = value => {
    this.props.onClose(value);
  };
  render() {
    const { classes, items, onClose, selectedValue, ...other } = this.props;

    return (
      <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
        <div>
          <List>
            {items.map(item => (
              <ListItem button onClick={() => this.handleListItemClick(item.id)} key={item.id}>
                <ListItemText primary={item.label} secondary={item.description} />
              </ListItem>
            ))}
          </List>
        </div>
      </Dialog>
    );
  }
}


export class MapHeader extends Component {
  static propTypes = {
    demographic: PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string
    }),
    region: PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string
    }),
    metric: PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string
    }),
    onRegionChange: PropTypes.func,
    onDemographicChange: PropTypes.func,
    onMetricChange: PropTypes.func
  }

  state = {
    open: false,
    selectedValue: '',
    items: [],
    type: ''
  };

  _triggerMenu = (type) => {
    switch(type) {
      case 'demographic':
        this.setState({
          open: true,
          type,
          selectedValue: this.props.demographic.id,
          items: getDemographics()
        });
        break;
      case 'metric':
        this.setState({
          open: true,
          type,
          selectedValue: this.props.metric.id,
          items: getMetrics().filter(m => m.map)
        });
        break;
      case 'region':
        this.setState({
          open: true,
          type,
          selectedValue: this.props.region.id,
          items: getRegions()
        });
        break;
      default:
        return;
    }
  }

  _handleClose = value => {
    switch(this.state.type) {
      case 'demographic':
        this.props.onDemographicChange(value)
        break;
      case 'metric':
        this.props.onMetricChange(value)
        break;
      case 'region':
        this.props.onRegionChange(value)
        break;
      default:
        return;
    }
    this.setState({ selectedValue: value, open: false });
  };

  render() {
    const { demographic, metric, region } = this.props;
    return (
      <div className="map-header">
        <Typography variant="h6">
          Showing {' '}
          <Hint 
            text="press to change data metric" 
            cursor="pointer"
            onClick={() => this._triggerMenu('metric')}
          >
            {metric.label.toLowerCase()}
          </Hint>
          {' '}for{' '}
          <Hint 
            text="press to change demographic" 
            cursor="pointer"
            onClick={() => this._triggerMenu('demographic')}
          >
            {demographic.id === 'all' ? 'all' : demographic.label.toLowerCase()} students
          </Hint>
          {' '}in{' '}
          <Hint 
            text="press to change region" 
            cursor="pointer"
            onClick={() => this._triggerMenu('region')}
          >
            {region.label.toLowerCase()}
          </Hint>
        </Typography>
        <MenuDialog
          selectedValue={this.state.selectedValue}
          open={this.state.open}
          items={this.state.items}
          onClose={this._handleClose}
        />
      </div>
    )
  }
}

const mapStateToProps = (
  state, 
  { match: { params: { region, metric, demographic } } }
) => { 
  return ({
    region: getRegionById(region),
    demographic: getDemographicById(demographic),
    metric: getMetricById(metric),
  })
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onMetricChange: (value) => updateRoute(ownProps, { metric: value }),
  onRegionChange: (value) => updateRoute(ownProps, { region: value }),
  onDemographicChange: (value) => updateRoute(ownProps, { demographic: value }),
})

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(MapHeader)
