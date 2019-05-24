import React, {Component} from 'react';
import MapGL, {Marker, Popup, NavigationControl} from 'react-map-gl';
import CityPin from './city-pin';
import CityInfo from './city-info';
import { compose } from 'recompose';
import withAuthorization from '../Session/withAuthorization';
import { withFirebase } from '../Firebase';
import 'mapbox-gl/dist/mapbox-gl.css';
import DeckGL, {ArcLayer} from 'deck.gl';

import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { SliderRail, Handle, Track, Tick } from "../DatePicker/components"; // example render components - source below
import { subDays, startOfToday, format, addDays } from "date-fns";
import { scaleTime } from "d3-scale";

const sliderStyle = {
  position: "relative",
  width: "100%",
};

function formatTick(ms) {
  //return format(new Date(ms), "ddd MMM Do YYYY");
  return format(new Date(ms), "M/D/YYYY");
}

const halfHour = 1000 * 60 * 60 * 24;

const TOKEN = 'pk.eyJ1IjoibWFyaW9wbiIsImEiOiJjanJ0NTBmN28waHZkNDluOGlna29keGxwIn0.Wp6-w3f9R3tf_F5vaBjN4w'; // Set your mapbox token here

const navStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
};

class Map extends Component {

  constructor(props) {
    super(props);
    const today = startOfToday();
    //const fourDaysAgo = subDays(today, 4);
    const oneWeekAgo = subDays(today, 10);
    const future = addDays(today, 1);
    this.state = {
      viewport: {
        latitude: 44.412857,
        longitude: 5.751657,
        zoom: 0.89,
        bearing: 0,
        pitch: 0,
        minZoom: 0.89
      },
      popupInfo: null,
      arrayFirms: [],
      features: [],
      preFirms: [],
      preFeatures: [],
      selected: today,
      min: oneWeekAgo,
      max: future/*today*/,
      date: ''
    };
    this.onChange = this.onChange.bind(this);
    this.redraw = this.redraw.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.hubMount = this.hubMount.bind(this);
  }

  redraw({project}) {
    const [cx, cy] = project([-122, 37]);
    return <circle cx={cx} cy={cy} r={4} fill="blue" />;
  }

  onChange = ([ms]) => {
    this.setState({
      selected: new Date(ms)
    });
    this.props.firebase.node(this.props.firebase.auth.currentUser.uid).on('value', snapshot => {
      this.hubMount(snapshot)
    });
  };

  onUpdate = ([ms]) => {
    this.setState({
      selected: new Date(ms)
    });
    this.props.firebase.node(this.props.firebase.auth.currentUser.uid).on('value', snapshot => {
      this.hubMount(snapshot)
    });
  };

  hubMount(snapshot){
    var features = [];
    var firms = [];
    var p = [];
    p.push({uid: snapshot.val().uid, longitude: snapshot.val().longitude, latitude: snapshot.val().latitude});
    if(new Date(snapshot.val().dateIn) <= this.state.selected && (snapshot.val().dateOut === '' || new Date(snapshot.val().dateOut) > this.state.selected)){
      firms.push({
        "firm": snapshot.val().username,
        "city": snapshot.val().city || "Unknown",
        "country": snapshot.val().country || "Unknown",
        "category": snapshot.val().category,
        "latitude": parseFloat(snapshot.val().latitude),
        "longitude": parseFloat(snapshot.val().longitude),
        "description": snapshot.val().description,
        "dateIn": snapshot.val().dateIn,
        "dateOut": snapshot.val().dateOut,
        "uid": snapshot.val().uid,
        "projects": Object.keys(snapshot.val().projects).length
      });
    }
    this.props.firebase.nodes().on("value", fullNodes => {
      Object.values(fullNodes.val()).map(node => {
        if(snapshot.val().parents !== "") {
          Object.values(snapshot.val().parents).map(parent => {
            if (node.uid === parent.uid) {
              if (new Date(parent.dateIn) <= this.state.selected && (parent.dateOut === '' || new Date(parent.dateOut) > this.state.selected)){
                if (new Date(node.dateIn) <= this.state.selected && (node.dateOut === '' || new Date(node.dateOut) > this.state.selected)) {
                  firms.push({
                    "firm": node.username,
                    "city": node.city || "Unknown",
                    "country": node.country || "Unknown",
                    "category": node.category,
                    "latitude": parseFloat(node.latitude),
                    "longitude": parseFloat(node.longitude),
                    "description": node.description,
                    "dateIn": node.dateIn,
                    "dateOut": node.dateOut,
                    "uid": node.uid,
                    "projects": Object.keys(node.projects).length
                  });
                  features.push({
                    dateIn: snapshot.val().dateIn,
                    sourcePosition: [parseFloat(node.longitude), parseFloat(node.latitude)],
                    targetPosition: [parseFloat(snapshot.val().longitude),
                      parseFloat(snapshot.val().latitude)],
                  })
                }
              }
            }
          })
        }
      })
    });

    this.props.firebase.nodes().on("value", fullNodes => {
      Object.values(fullNodes.val()).map(node => {
        if(snapshot.val().parents !== "") {
          Object.values(snapshot.val().parents).map(parent => {
            if(node.uid === parent.uid){
              if (new Date(parent.dateIn) <= this.state.selected && (parent.dateOut === '' || new Date(parent.dateOut) > this.state.selected)){
                if(new Date(node.dateIn) <= this.state.selected && (node.dateOut === '' || new Date(node.dateOut) > this.state.selected)){
                  firms.push({
                    "firm": node.username,
                    "city": node.city || "Unknown",
                    "country": node.country || "Unknown",
                    "category": node.category,
                    "latitude": parseFloat(node.latitude),
                    "longitude": parseFloat(node.longitude),
                    "description": node.description,
                    "dateIn": node.dateIn,
                    "dateOut": node.dateOut,
                    "uid": node.uid,
                    "projects": Object.keys(node.projects).length
                  });
                  features.push({
                    dateIn: snapshot.val().dateIn,
                    sourcePosition: [parseFloat(node.longitude), parseFloat(node.latitude)],
                    targetPosition: [parseFloat(snapshot.val().longitude),
                      parseFloat(snapshot.val().latitude)],
                  })
                }
              }
            }
          })
        }
      });
      for(var i = 0; i<p.length; i++){
        Object.values(fullNodes.val()).map(node => {
          if (node.parents !== "") {
            Object.values(node.parents).map(parent => {
              if(parent.uid === p[i].uid){
                if (new Date(parent.dateIn) <= this.state.selected && (parent.dateOut === '' || new Date(parent.dateOut) > this.state.selected)){
                  if(new Date(node.dateIn) <= this.state.selected && (node.dateOut === '' || new Date(node.dateOut) > this.state.selected)){
                    firms.push({
                      "firm": node.username,
                      "city": node.city || "Unknown",
                      "country": node.country || "Unknown",
                      "category": node.category,
                      "latitude": parseFloat(node.latitude),
                      "longitude": parseFloat(node.longitude),
                      "description": node.description,
                      "dateIn": node.dateIn,
                      "dateOut": node.dateOut,
                      "uid": node.uid,
                      "projects": Object.keys(node.projects).length
                    });
                    features.push({
                      dateIn: node.dateIn,
                      sourcePosition: [parseFloat(node.longitude), parseFloat(node.latitude)],
                      targetPosition: [parseFloat(p[i].longitude), parseFloat(p[i].latitude)],
                    })
                    p.push({uid: node.uid, longitude: node.longitude, latitude: node.latitude})
                  }
                }
              }
            })
          }

        });
      }
      this.setState({arrayFirms: firms, features: features})
    });
  }

  componentDidMount(){
    this.props.firebase.node(this.props.firebase.auth.currentUser.uid).on('value', snapshot => {
      //this.setState({date: subDays(new Date(snapshot.val().dateIn), 2)})
      this.setState({date: new Date(snapshot.val().dateIn)})
      this.hubMount(snapshot)
    });
  }

  componentWillUnmount() {
    this.props.firebase.nodes().off();
    this.props.firebase.node().off();
  }

  _updateViewport = (viewport) => {
    this.setState({viewport});
  };

  _renderCityMarker = (firm, index) => {
    return (
      <Marker
        key={`marker-${index}`}
        longitude={firm.longitude}
        latitude={firm.latitude} >
        <CityPin info={firm} size={20} onClick={() => this.setState({popupInfo: firm})} />
      </Marker>
    );
  };

  _renderPopup() {
    const {popupInfo} = this.state;

    return popupInfo && (
      <Popup
         tipSize={5}
         anchor="top"
         longitude={popupInfo.longitude}
         latitude={popupInfo.latitude}
         closeOnClick={true}
         onClose={() => this.setState({popupInfo: null})} >
        <CityInfo info={popupInfo} />
      </Popup>
    );
  }

  render() {
    const {viewport} = this.state;

    const { min, max, selected, date } = this.state;

    const dateTicks = scaleTime()
      .domain([date, max])
      .ticks(7)
      .map(d => +d);

    return (
      <div className="container">
        <MapGL
          ref={(reactMap) => { this.reactMap = reactMap; }}
          style={{marginTop: '1%'}}
          {...viewport}
          width="100%"
          height="620px"
          mapStyle="mapbox://styles/mapbox/streets-v11"
          onViewportChange={this._updateViewport}
          mapboxApiAccessToken={TOKEN} >
          <div className="nav" style={navStyle}>
            <NavigationControl onViewportChange={this._updateViewport} />
          </div>
          <DeckGL {...viewport} layers={[
            new ArcLayer({
              data: this.state.features,
              strokeWidth: 2,
              getSourceColor: x => [100, 100, 100],
              getTargetColor: x => [100, 100, 100]
            })
          ]}/>
          { this.state.arrayFirms.map(this._renderCityMarker) }
          {this._renderPopup()}
        </MapGL>
        <div style={{ marginLeft: "5%", marginRight: '5%', marginTop: '2%', height: 50, width: "90%" }}>
          <Slider
            mode={1}
            step={halfHour}
            domain={[+date, +max]}
            rootStyle={sliderStyle}
            onUpdate={this.onUpdate}
            onChange={this.onChange}
            values={[+selected]}
          >
            <Rail>
              {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
            </Rail>
            <Handles>
              {({ handles, getHandleProps }) => (
                <div>
                  {handles.map(handle => (
                    <Handle
                      key={handle.id}
                      handle={handle}
                      domain={[+date, +max]}
                      getHandleProps={getHandleProps}
                    />
                  ))}
                </div>
              )}
            </Handles>
            <Tracks right={false}>
              {({ tracks, getTrackProps }) => (
                <div>
                  {tracks.map(({ id, source, target }) => (
                    <Track
                      key={id}
                      source={source}
                      target={target}
                      getTrackProps={getTrackProps}
                    />
                  ))}
                </div>
              )}
            </Tracks>
            <Ticks values={dateTicks}>
              {({ ticks }) => (
                <div>
                  {ticks.map(tick => (
                    <Tick
                      key={tick.id}
                      tick={tick}
                      count={ticks.length}
                      format={formatTick}
                    />
                  ))}
                </div>
              )}
            </Ticks>
          </Slider>
        </div>
      </div>
    );
  }

}


const condition = authUser => !!authUser ;

export default compose(
  withAuthorization(condition),
  withFirebase,
)(Map);