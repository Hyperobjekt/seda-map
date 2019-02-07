import React, { Component } from 'react'
import ReactMapGL from 'react-map-gl';

class Map extends Component {

  state = {
    viewport: {
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 8
    }
  };

  getContainerSize() {
    if (!this.mapContainer) {
      return { width: 400, height: 400 }
    }
    return {
      width: this.mapContainer.clientWidth,
      height: this.mapContainer.clientHeight
    }
  }

  handleResize() {
    this.updateDimensions();
  }

  updateDimensions(dimensions = this.getContainerSize()) {
    this.setState({ 
      viewport: { 
        ...this.state.viewport, 
        ...dimensions 
      }
    });
  }
  componentDidMount() {
      window.addEventListener(
        'resize', this.handleResize.bind(this)
      );
      this.updateDimensions();
  }
  componentWillUnmount() {
      window.removeEventListener(
        'resize', this.handleResize.bind(this)
      );
  }

  render() {
    return (
      <div 
        className="map"
        ref={ (el) => this.mapContainer = el }
      >
        <div 
          className="map__container"
        >
          <ReactMapGL
            { ...this.state.viewport }
            onViewportChange={ (viewport) => this.setState({ viewport }) }
          />
        </div>
      </div>
    );
  }
}

export default Map;
