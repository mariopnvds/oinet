import React from 'react';
import { withFirebase } from '../../Firebase';
import Chart from 'react-google-charts';
import { format, startOfToday, subDays, addDays } from 'date-fns';
import { scaleTime } from 'd3-scale';
import { Handles, Rail, Slider, Ticks, Tracks } from 'react-compound-slider';
import { Handle, SliderRail, Tick, Track } from '../../DatePicker/components';

const sliderStyle = {
  position: "relative",
  width: "100%",
};

function formatTick(ms) {
  //return format(new Date(ms), "ddd MMM Do YYYY");
  return format(new Date(ms), "M/D/YYYY");
}
const halfHour = 1000 * 60 * 60 * 24;

class PieChart extends React.Component{
  constructor(props){
    super(props);
    const today = startOfToday();
    const oneWeekAgo = subDays(today, 30);
    const future = addDays(today, 1)
    this.state={
      date: '',
      eu: 0,
      na: 0,
      sa: 0,
      as: 0,
      af: 0,
      oc: 0,
      selected: today,
      min: oneWeekAgo,
      max: future,
    }
    this.rootMount = this.rootMount.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onChange = this.onChange.bind(this);
    this.rehubMount = this.rehubMount.bind(this);
  }

  rootMount(){
    var eu = 0;
    var na = 0;
    var sa = 0;
    var as = 0;
    var oc = 0;
    var af = 0;
    this.props.firebase.nodes().on("value", snapshot => {
      Object.values(snapshot.val()).map(node => {
        if(node.dateIn <= format(this.state.selected, "M/D/YYYY") && (node.dateOut === '' || node.dateOut > format(this.state.selected, "M/D/YYYY"))){
          if(node.continent === "Europe"){
            eu++
          } if(node.continent === "North America"){
            na++
          } if(node.continent === "South America"){
            sa++
          } if(node.continent === "Asia"){
            as++
          } if(node.continent === "Africa"){
            af++
          } if(node.continent === "Oceania"){
            oc++
          }
        }

      });
      this.setState({eu: eu, na: na, sa: sa, oc: oc, af: af, as: as})
    })
  }

  onChange = ([ms]) => {
    this.setState({
      selected: new Date(ms)
    });
    this.props.firebase.node(this.props.firebase.auth.currentUser.uid).on('value', snapshot => {
      this.rehubMount(snapshot);
    })
  };

  onUpdate = ([ms]) => {
    this.setState({
      selected: new Date(ms)
    });
    this.props.firebase.node(this.props.firebase.auth.currentUser.uid).on('value', snapshot => {
      this.rehubMount(snapshot);
    })
  };

  rehubMount(snapshot){
    var eu = 0;
    var na = 0;
    var sa = 0;
    var as = 0;
    var oc = 0;
    var af = 0;
    var parents = [];
    parents.push(snapshot.val().uid);
    if(new Date(snapshot.val().dateIn) <= this.state.selected && (snapshot.val().dateOut === '' || new Date(snapshot.val().dateOut) > this.state.selected)){
      if(snapshot.val().continent === "Europe"){
        eu++
      } if(snapshot.val().continent === "North America"){
        na++
      } if(snapshot.val().continent === "South America"){
        sa++
      } if(snapshot.val().continent === "Asia"){
        as++
      } if(snapshot.val().continent === "Africa"){
        af++
      } if(snapshot.val().continent === "Oceania"){
        oc++
      }
    }
    this.props.firebase.nodes().on("value", fullNodes => {
      /*Object.values(fullNodes.val()).map(node => {
        if(node.parents !== "") {
          Object.values(node.parents).map(parent => {
            if (parent.uid === snapshot.val().parent) {
              if(new Date(node.dateIn) <= this.state.selected && (node.dateOut === '' || new Date(node.dateOut) > this.state.selected)){
                console.log(node.username)
                if(node.continent === "Europe"){
                  eu++
                } if(node.continent === "North America"){
                  na++
                } if(node.continent === "South America"){
                  sa++
                } if(node.continent === "Asia"){
                  as++
                } if(node.continent === "Africa"){
                  af++
                } if(node.continent === "Oceania"){
                  oc++
                }
              }
            }
          })
        }
        /*if(node.uid === snapshot.val().parent){
          if(new Date(node.dateIn) <= this.state.selected && (node.dateOut === '' || new Date(node.dateOut) > this.state.selected)){
            if(node.continent === "Europe"){
              eu++
            } if(node.continent === "North America"){
              na++
            } if(node.continent === "South America"){
              sa++
            } if(node.continent === "Asia"){
              as++
            } if(node.continent === "Africa"){
              af++
            } if(node.continent === "Oceania"){
              oc++
            }
          }
        }
      });*/
      for(var i = 0; i<parents.length; i++){
        Object.values(fullNodes.val()).map(node => {
          if(node.parents !== "") {
            Object.values(node.parents).map(parent => {
              if (parent.uid === parents[i]) {
                if(new Date(node.dateIn) <= this.state.selected && (node.dateOut === '' || new Date(node.dateOut) > this.state.selected)){
                  parents.push(node.uid);
                  if(node.continent === "Europe"){
                    eu++
                  } if(node.continent === "North America"){
                    na++
                  } if(node.continent === "South America"){
                    sa++
                  } if(node.continent === "Asia"){
                    as++
                  } if(node.continent === "Africa"){
                    af++
                  } if(node.continent === "Oceania"){
                    oc++
                  }
                }
              }
            })
          }
          /*if(node.parent === parents[i]){
            if(new Date(node.dateIn) <= this.state.selected && (node.dateOut === '' || new Date(node.dateOut) > this.state.selected)){
              parents.push(node.uid);
              if(node.continent === "Europe"){
                eu++
              } if(node.continent === "North America"){
                na++
              } if(node.continent === "South America"){
                sa++
              } if(node.continent === "Asia"){
                as++
              } if(node.continent === "Africa"){
                af++
              } if(node.continent === "Oceania"){
                oc++
              }
            }
          }*/
        });
      }
      this.setState({eu: eu, na: na, sa: sa, oc: oc, af: af, as: as})
    });
  }

  /*hubMount(snapshot){
    var eu = 0;
    var na = 0;
    var sa = 0;
    var as = 0;
    var oc = 0;
    var af = 0;
    var p = [];
    this.props.firebase.nodes().on("value", fullNodes => {
      p.push(snapshot.val().uid);
      console.log(snapshot.val().username)
      if(new Date(snapshot.val().dateIn) <= this.state.selected && (snapshot.val().dateOut === '' || new Date(snapshot.val().dateOut) > this.state.selected)){
        if(snapshot.val().continent === "Europe"){
          eu++
        } if(snapshot.val().continent === "North America"){
          na++
        } if(snapshot.val().continent === "South America"){
          sa++
        } if(snapshot.val().continent === "Asia"){
          as++
        } if(snapshot.val().continent === "Africa"){
          af++
        } if(snapshot.val().continent === "Oceania"){
          oc++
        }
      }
      Object.values(fullNodes.val()).map(node => {
        if(node.uid === snapshot.val().parent){
          if(new Date(node.dateIn) <= this.state.selected && (node.dateOut === '' || new Date(node.dateOut) > this.state.selected)){
            if(node.continent === "Europe"){
              eu++
            } if(node.continent === "North America"){
              na++
            } if(node.continent === "South America"){
              sa++
            } if(node.continent === "Asia"){
              as++
            } if(node.continent === "Africa"){
              af++
            } if(node.continent === "Oceania"){
              oc++
            }
          }
        }
        p.map( uid => {
          if(node.parent === uid){
            if(new Date(node.dateIn) <= this.state.selected && (node.dateOut === '' || new Date(node.dateOut) > this.state.selected)){
              if(node.continent === "Europe"){
                eu++
              } if(node.continent === "North America"){
                na++
              } if(node.continent === "South America"){
                sa++
              } if(node.continent === "Asia"){
                as++
              } if(node.continent === "Africa"){
                af++
              } if(node.continent === "Oceania"){
                oc++
              }
              p.push(node.uid)
            }
          }
        })
      });
      this.setState({eu: eu, na: na, sa: sa, oc: oc, af: af, as: as})
    })
  }*/

  componentDidMount() {
    this.props.firebase.node(this.props.firebase.auth.currentUser.uid).on('value', snapshot => {
      this.setState({date: new Date(snapshot.val().dateIn)})

      this.rehubMount(snapshot);
    })
  }

  render() {
    const {min, max, selected, date} = this.state;
    const dateTicks = scaleTime()
      .domain([date, max])
      .ticks(7)
      .map(d => +d);
    return (
      <div className="card" style={{margin: 'auto', width: '60%', marginTop: '1%'}}>
        <div className="card-header">
          Geographical Distribution <small>{`(${new Date().getFullYear().toString()})`}</small>
        </div>
        <div className="card-body">
          <Chart
            chartType="PieChart"
            data={[
              ["Continent", "Number of Entities"],
              ["Europe", this.state.eu], ["North America", this.state.na], ["South America", this.state.sa], ["Asia", this.state.as], ["Africa", this.state.af], ["Oceania", this.state.oc]
            ]}
            options={{
              legend: {
                position: "right",
                alignment: "center",
                textStyle: {
                  color: "233238",
                  fontSize: 14
                }
              },
              tooltip: {
                showColorCode: true
              },
              chartArea: {
                left: 0,
                top: 12,
                bottom: 12,
                width: "100%",
                height: "100%"
              },
              fontName: "Helvetica"
            }}
            width={"100%"}
            height={"100%"}
            legend_toggle
          />
        </div>
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

export default withFirebase(PieChart);