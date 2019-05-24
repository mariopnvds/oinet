import React from 'react';
import Graph from 'vis-react';
import { compose } from 'recompose';
import withAuthorization from '../Session/withAuthorization';
import { withFirebase } from '../Firebase';
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { SliderRail, Handle, Track, Tick } from "../DatePicker/components"; // example render components - source below
import { subDays, startOfToday, format, addDays, differenceInCalendarDays } from "date-fns";
import { scaleTime } from "d3-scale";

const sliderStyle = {
  position: "relative",
  width: "100%",
};

const random = {
    height: '620px',
    layout: {
      randomSeed: 8305864068299,//undefined,
      improvedLayout: true,
    },
    groups: {
      deleted: {color:{background:'red'}},
    },
    nodes: {
      shape: 'dot',
      size: 15,
      font: {
        size: 12,
        face: 'Tahoma'
      },
      scaling: {
        label: {
          min: 8,
          max: 20
        }
      },
    },
    edges: {
      width: 0.1,
      smooth: {
        type: 'continuous'
      },
      color: {
        inherit: 'from',
        highlight: '#797979',
        hover: '#797979',
        opacity: 1.0
      },
      arrows: {
        to: {enabled: false},
        from: {enabled: false}
      },
    },
    physics: {
      enabled: true,
      forceAtlas2Based: {
        gravitationalConstant: -40,
        centralGravity: 0.005,
        springLength: 23,
        springConstant: 0.002
      },
      maxVelocity: 146,
      solver: 'forceAtlas2Based',
      timestep: 0.35,
      stabilization: {
        enabled: true,
        fit: true,
      },
      barnesHut: {
        gravitationalConstant: -800,
        springConstant: 0.001,
        springLength: 20
      },
      repulsion: {
        nodeDistance: 60,
        centralGravity: 0.005,
        springLength: 23,
        springConstant: 0.002
      }
    },
    autoResize: true,
    interaction: {
      navigationButtons: true,
      tooltipDelay: 200,
      hover: true,
      hoverConnectedEdges: true,
      selectConnectedEdges: true,
  }
};

const hier = {
  height: '620px',
  layout: {
    randomSeed: undefined,
    improvedLayout: true,
    hierarchical: {
      enabled:true,
      levelSeparation: 20,
      nodeSpacing: 100,
      blockShifting: true,
      edgeMinimization: true,
      parentCentralization: true,
      direction: 'UD',
      sortMethod: 'directed'
    }
  },
  groups: {
    deleted: {color:{background:'red'}},
  },
  nodes: {
    shape: 'dot',
    size: 15,
    font: {
      size: 12,
      face: 'Tahoma'
    },
    scaling: {
      label: {
        min: 8,
        max: 20
      }
    },
  },
  edges: {
    width: 0.1,
    smooth: {
      type: 'continuous'
    },
    color: {
      inherit: 'from',
      highlight: '#797979',
      hover: '#797979',
      opacity: 1.0
    },
    arrows: {
      to: {enabled: false},
      from: {enabled: false}
    },
  },
  physics: {
    enabled: true,
    forceAtlas2Based: {
      gravitationalConstant: -40,
      centralGravity: 0.005,
      springLength: 23,
      springConstant: 0.002
    },
    maxVelocity: 146,
    solver: 'forceAtlas2Based',
    timestep: 0.35,
    stabilization: {
      enabled: true,
      fit: true,
    },
    barnesHut: {
      gravitationalConstant: -800,
      springConstant: 0.001,
      springLength: 20
    },
    repulsion: {
      nodeDistance: 60,
      centralGravity: 0.005,
      springLength: 23,
      springConstant: 0.002
    }
  },
  autoResize: true,
  interaction: {
    navigationButtons: true,
    tooltipDelay: 200,
    hover: true,
    hoverConnectedEdges: true,
    selectConnectedEdges: true,
  }
}

function formatTick(ms) {
  //return format(new Date(ms), "ddd MMM Do YYYY");
  return format(new Date(ms), "M/D/YYYY");
}

const halfHour = 1000 * 60 * 60 * 24;
let allNodes;
var highlightActive = false;
var clusterIndex = 0;
var clusters = [];
var lastClusterZoomLevel = 0.5;
var clusterFactor = 0.5;

class Network extends React.Component{
  constructor(props){
    super(props);
    const today = startOfToday();
    const oneWeekAgo = subDays(today, 10);
    const future = addDays(today, 1)
    this.state = {
      fullNodes: [],
      date: '',
      nodes: [],
      edges: [],
      network: null,
      selected: today,
      min: oneWeekAgo,
      max: future,
      options: random
    };

    this.events = {
      select: function (event) {
        var {nodes, edges} = event;
        console.log('Selected nodes:');
        console.log(nodes);
        console.log('Selected edges:');
        console.log(edges);
      },
      /*hoverNode: function (event) {
          this.neighbourhoodHighlight(event);
      },
      zoom: function (params) {
          this.zoom(params);
      },*/
      /*selectNode: function (params) {
          this.selectNode(params);
      },*/
      blurNode: function (event) {
        this.neighbourhoodHighlightHide(event);
      },
      doubleClick: function (event) {
        this.redirectToLearn(event);
      }
    };
    this.measure = this.measure.bind(this);
    this.redirectToLearn = this.redirectToLearn.bind(this);
    this.neighbourhoodHighlight = this.neighbourhoodHighlight.bind(this);
    this.neighbourhoodHighlightHide = this.neighbourhoodHighlightHide.bind(this);
    //this.events.zoom = this.events.zoom.bind(this);
    this.events.blurNode = this.events.blurNode.bind(this);
    this.events.doubleClick = this.events.doubleClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
  }

  onChange = ([ms]) => {
    this.setState({
      selected: new Date(ms)
    });
    this.props.firebase.node(this.props.firebase.auth.currentUser.uid).on('value', snapshot => {
      this.hubMount(snapshot)
    })

  };

  onUpdate = ([ms]) => {
    this.setState({
      selected: new Date(ms)
    });
    this.props.firebase.node(this.props.firebase.auth.currentUser.uid).on('value', snapshot => {
      this.hubMount(snapshot)
    })
  };

  hubMount(snapshot){
    var nodes = [];
    var edges = [];
    var parents = [];
    parents.push(snapshot.val().uid);
    if(new Date(snapshot.val().dateIn) <= this.state.selected && (snapshot.val().dateOut === '' || new Date(snapshot.val().dateOut) > this.state.selected)){
      nodes.push({
        id: snapshot.val().uid,
        label: snapshot.val().username,
        dateIn: snapshot.val().dateIn,
        dateOut: snapshot.val().dateOut,
        title: "Entity: " + snapshot.val().username +
          "<hr/>" + "City: " + snapshot.val().city +
          "<br/>" + "Country: " + snapshot.val().country +
          "<hr/>" + "Nº Projects: " + Object.keys(snapshot.val().projects).length
      });
    }
    this.props.firebase.nodes().on("value", fullNodes => {
      Object.values(fullNodes.val()).map(node => {
        if(snapshot.val().parents !== ""){
          Object.values(snapshot.val().parents).map(parent => {
            if(parent.uid === node.uid){
              if(new Date(parent.dateIn) <= this.state.selected && (parent.dateOut === '' || new Date(parent.dateOut) > this.state.selected)){
                if(new Date(node.dateIn) <= this.state.selected && (node.dateOut === '' || new Date(node.dateOut) > this.state.selected)){
                  nodes.push({
                    id: node.uid,
                    label: node.username,
                    dateIn: node.dateIn,
                    dateOut: node.dateOut,
                    title: "Entity: " + node.username +
                      "<hr/>" + "City: " + node.city +
                      "<br/>" + "Country: " + node.country +
                      "<hr/>" + "Nº Projects: " + Object.keys(node.projects).length
                  }); edges.push({
                    from: node.uid,
                    dateIn: node.dateIn,
                    dateOut: node.dateOut,
                    to: snapshot.val().uid,
                    value:  Object.keys(node.projects).length,
                    dashes: node.activity,
                    title: "Nº Projects: " + Object.keys(node.projects).length
                  })
                }
              }
            }
          })
        }
      });
      for(var i = 0; i<parents.length; i++){
        Object.values(fullNodes.val()).map(node => {
          if(node.parents !== "") {
            Object.values(node.parents).map(parent => {
              if (parent.uid === parents[i]) {
                if (new Date(parent.dateIn) <= this.state.selected && (parent.dateOut === '' || new Date(parent.dateOut) > this.state.selected)) {
                  if(new Date(node.dateIn) <= this.state.selected && (node.dateOut === '' || new Date(node.dateOut) > this.state.selected)){
                    parents.push(node.uid);
                    nodes.push({
                      id: node.uid,
                      label: node.username,
                      dateIn: node.dateIn,
                      dateOut: node.dateOut,
                      title: "Entity: " + node.username +
                        "<hr/>" + "City: " + node.city +
                        "<br/>" + "Country: " + node.country +
                        "<hr/>" + "Nº Projects: " + Object.keys(node.projects).length
                    });
                    edges.push({
                      from: parents[i],
                      dateIn: node.dateIn,
                      dateOut: node.dateOut,
                      to: node.uid,
                      value:  Object.keys(node.projects).length,
                      dashes: node.activity,
                      title: "Nº Projects: " + Object.keys(node.projects).length
                    });
                  }
                }
              }
            })
          }
        });
      }
      this.setState({nodes: nodes, edges: edges})
    });
  }

  componentDidMount() {
    this.props.firebase.node(this.props.firebase.auth.currentUser.uid).on('value', snapshot => {
      this.setState({date: new Date(snapshot.val().dateIn)})
      this.hubMount(snapshot);
    })
  }

  componentWillUnmount() {
    this.props.firebase.node().off();
    this.props.firebase.nodes().off();
  }

  redirectToLearn(params) {

  }

  /*
  * Redraw the graph when change window size.
  */
  measure(data) {
    this.state.network.redraw();
    this.state.network.fit();
  }

  /*
   * Get the network to print the data
   */
  getNetwork(data) {
    this.setState({ network: data });
  }

  /*
  * Neighbor nodes highligths when clicked
  */
  neighbourhoodHighlight(params) {
    let allNodes = this.state.nodes;
    let Nodes = new this.vis.DataSet(allNodes);
    let cloneNodes = Nodes.get({ returnType: 'Object' });
    if (params.node !== undefined) {
      highlightActive = true;
      let i, j;
      let selectedNode = params.node;
      let degrees = 1;
      for (var nodeId in cloneNodes) {
        cloneNodes[nodeId].color = 'rgba(200,200,200,0.5)';
        if (cloneNodes[nodeId].hiddenLabel === undefined) {
          cloneNodes[nodeId].hiddenLabel = cloneNodes[nodeId].label;
          cloneNodes[nodeId].label = undefined;
        }
      }
      let connectedNodes = this.state.network.getConnectedNodes(selectedNode);
      let allConnectedNodes = [];
      // get the second degree nodes
      for (i = 1; i < degrees; i++) {
        for (j = 0; j < connectedNodes.length; j++) {
          allConnectedNodes = allConnectedNodes.concat(
            this.state.network.getConnectedNodes(connectedNodes[j])
          );
        }
      }
      // all second degree nodes get a different color and their label back
      for (i = 0; i < allConnectedNodes.length; i++) {
        cloneNodes[allConnectedNodes[i]].color = 'rgba(150,150,150,0.75)';
        if (cloneNodes[allConnectedNodes[i]].hiddenLabel !== undefined) {
          cloneNodes[allConnectedNodes[i]].label = cloneNodes[allConnectedNodes[i]].hiddenLabel;
          cloneNodes[allConnectedNodes[i]].hiddenLabel = undefined;
        }
      }
      // all first degree nodes get their own color and their label back
      for (let i = 0; i < connectedNodes.length; i++) {
        cloneNodes[connectedNodes[i]].color = undefined;
        if (cloneNodes[connectedNodes[i]]['hiddenLabel'] !== undefined) {
          cloneNodes[connectedNodes[i]].label = cloneNodes[connectedNodes[i]]['hiddenLabel'];
          const fontSize = this.state.network.body.nodes;
          fontSize[connectedNodes[i]].options.font.size = 15;
          cloneNodes[connectedNodes[i]]['hiddenLabel'] = undefined;
        }
      }
      // the main node gets its own color and its label back.
      cloneNodes[selectedNode].color = undefined;
      if (cloneNodes[selectedNode]['hiddenLabel'] !== undefined) {
        cloneNodes[selectedNode].label = cloneNodes[selectedNode]['hiddenLabel'];
        const fontSize = this.state.network.body.nodes;
        fontSize[selectedNode].options.font.size = 15;
        // this.setState({fontSize})
        cloneNodes[selectedNode]['hiddenLabel'] = undefined;
      }
    } else if (highlightActive === true) {
      // reset all nodes
      for (let nodeId in cloneNodes) {
        cloneNodes[nodeId].color = undefined;
        if (cloneNodes[nodeId]['hiddenLabel'] !== undefined) {
          cloneNodes[nodeId].label = cloneNodes[nodeId]['hiddenLabel'];
          console.log(this.state.network.body);
          const fontSize = this.state.network.body.nodes;
          fontSize[nodeId].options.font.size = 15;
          this.setState({ fontSize });
          cloneNodes[nodeId]['hiddenLabel'] = undefined;
        }
      }
      highlightActive = false;
    }
    let updateArray = [];
    for (let nodeId in cloneNodes) {
      if (cloneNodes.hasOwnProperty(nodeId)) {
        updateArray.push(cloneNodes[nodeId]);
      }
    }
  }

  /*
  * Neighbor nodes unhighligths when clicked outside
  */
  neighbourhoodHighlightHide(params) {
    let allNodes = this.state.nodes;
    let Nodes = new this.vis.DataSet(allNodes);
    let allNodess = Nodes.get({ returnType: 'Object' });
    for (var nodeId in allNodess) {
      allNodess[nodeId].color = 'rgba(200,200,200,0.5)';
      if (allNodess[nodeId].hiddenLabel === undefined) {
        allNodess[nodeId].hiddenLabel = allNodess[nodeId].label;
        allNodess[nodeId].label = undefined;
      }
    }
    highlightActive = true;
    if (highlightActive === true) {
      // reset all nodes
      for (var nodeIds in allNodess) {
        allNodess[nodeIds].color = undefined;
        if (allNodess[nodeIds].hiddenLabel !== undefined) {
          allNodess[nodeIds].label = allNodess[nodeIds].hiddenLabel;
          const fontSize = this.state.network.body.nodes;
          fontSize[nodeIds].options.font.size = 15;
          this.setState({ fontSize });
          allNodess[nodeIds].hiddenLabel = undefined;
        }
      }
      highlightActive = false;
    }
    var updateArray = [];
    for (var nodeIde in allNodess) {
      if (allNodess.hasOwnProperty(nodeIde)) {
        updateArray.push(allNodess[nodeIde]);
      }
    }
  }

  render() {
    const { min, max, selected, nodes, edges, date } = this.state;
    const dateTicks = scaleTime()
      .domain([date, max])
      .ticks(7)
      .map(d => +d);
    return (
      <div className="container">
        <Graph
          graph={{ nodes: nodes, edges: edges }}
          options={this.state.options}
          events={this.events}
          getNetwork={this.getNetwork.bind(this)}
          vis={(vis) => {
            this.vis = vis
          }}
          style={{ marginTop: '1%', marginBottom: '15px', backgroundColor: '#e7e7e7'}}
        />

        <button id="hl" onClick={ () => { this.state.network.fit(); this.setState({options: hier}); }}
                className="pure-material-button-contained" style={{marginLeft: 'auto', marginRight: 'auto', position: 'absolute', top: '15px'}}>
          Hierarchical
        </button>
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
    )
  }
};

const condition = authUser => !!authUser ;

export default compose(
  withAuthorization(condition),
  withFirebase,
)(Network);
