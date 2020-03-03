import React, { createRef } from "react";

//react-leaflet
import {
  Map as ReactLeafletMap,
  TileLayer,
  ZoomControl,
  GeoJSON
} from "react-leaflet";
import "../node_modules/leaflet/dist/leaflet.css";

//material ui
import { withTheme } from "@material-ui/styles";

//d3
import { interpolateRgb } from "d3-interpolate";

//custom components
import AjaxGeojson from "./components/AjaxGeojson";
import DraggableRectangle from "./components/DraggableRectangle";
import Controls from "./components/Controls";

import { Context } from "./Store";

class Main extends React.Component {
  constructor(props) {
    super(props);

    // this.url = "http://api.spacesyntax.eicxv.com/get_geojson";
    this.url = "http://localhost:5000/get_geojson";

    this.state = {
      startBounds: [
        [57.6838877, 11.965842],
        [57.6938877, 11.975842]
      ],
      selectAreaActive: false,
      settingsChanged: false,
      center: [57.6838877, 11.975842],
      zoom: 8,
      geoKey: 0,
      geoJson: null,
      geoJsonRequest: null
    };

    this.mapRef = createRef();
    this.rectangleRef = createRef();
  }

  static contextType = Context;

  startSelectArea = () => {
    const newBounds = this.mapRef.current.contextValue.map
      .getBounds()
      .pad(-0.2);

    this.setState({
      selectAreaActive: true,
      startBounds: newBounds
    });
  };

  confirmSelectArea = () => {
    this.dispatch({
      type: "SET_BOUNDS",
      payload: this.rectangleRef.current.leafletElement._bounds
    });
    this.setState({
      selectAreaActive: false,
      settingsChanged: true
    });
  };

  cancelSelectArea = () => {
    this.setState({
      selectAreaActive: false
    });
  };

  getAnalysis = () => {
    const settings = this.store.settings;
    const requestOptions = {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      mode: "cors",
      body: JSON.stringify({
        networkType: settings.networkType,
        analysisType: settings.analysisType,
        bounds: {
          north: settings.bounds.getNorth(),
          south: settings.bounds.getSouth(),
          east: settings.bounds.getEast(),
          west: settings.bounds.getWest()
        }
      }),
      cache: "default"
    };

    this.setState({
      geoJsonRequest: new Request(this.url, requestOptions),
      settingsChanged: false
    });
  };

  ajaxGeojsonHandler = result => {
    //update key to force geojson redraw
    this.setState(state => ({
      geoJson: result,
      geoKey: state.geoKey + 1
    }));
  };

  geoJsonStyle(feature) {
    return {
      color: interpolateRgb.gamma(2.2)("blue", "red")(
        feature.properties.valueNormalized
      ),
      weight: 6
    };
  }

  geoJsonPopups(feature, layer) {
    if (feature.properties && feature.properties.value) {
      layer.bindPopup(feature.properties.value.toString());
    }
  }

  render() {
    [this.store, this.dispatch] = this.context;
    return (
      <div>
        <ReactLeafletMap
          center={this.state.center}
          zoom={this.state.zoom}
          zoomControl={false}
          editable={true}
          ref={this.mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <GeoJSON
            data={this.state.geoJson}
            key={this.state.geoKey}
            style={this.geoJsonStyle}
            onEachFeature={this.geoJsonPopups}
          />
          <ZoomControl position="bottomright" />
          {this.state.selectAreaActive ? (
            <DraggableRectangle
              bounds={this.state.startBounds}
              color={this.props.theme.palette.primary.dark}
              ref={this.rectangleRef}
            />
          ) : null}
        </ReactLeafletMap>
        <AjaxGeojson
          request={this.state.geoJsonRequest}
          success={this.ajaxGeojsonHandler}
        />
        <Controls
          settingsChanged={this.state.settingsChanged}
          startSelectArea={this.startSelectArea}
          confirmSelectArea={this.confirmSelectArea}
          cancelSelectArea={this.cancelSelectArea}
          getAnalysis={this.getAnalysis}
          selectAreaActive={this.state.selectAreaActive}
        />
      </div>
    );
  }
}

export default withTheme(Main);
