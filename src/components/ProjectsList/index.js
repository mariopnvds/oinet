import React from 'react';
import { compose } from 'recompose';
import withAuthorization from '../Session/withAuthorization';
import { withFirebase } from '../Firebase';
import CreateProj from '../CreateProj';
import OwnProjs from '../OwnProjs';
import NetProjs from '../NetProjs';

class ProjectsList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      users: [],
      firms: [],
      ownProjs: [],
      netProjs: []
    }
  }

  hubMount(snapshot){
    var ownProjs = [];
    var netProjs = [];
    var parents = [];

    parents.push(snapshot.val().uid);
    if(snapshot.val().projects !== undefined){
      Object.values(snapshot.val().projects).map(project => {
        ownProjs.push({project})
      })
    }
    this.props.firebase.nodes().on("value", fullNodes => {
      for(var i = 0; i<parents.length; i++){
        Object.values(fullNodes.val()).map(node => {
          if(node.parents !== "") {
            Object.values(node.parents).map(parent => {
              if (parent.uid === parents[i]) {
                if (new Date(parent.dateIn) <= new Date() && (parent.dateOut === '' || new Date(parent.dateOut) > new Date())) {
                  if(node.projects !== ""){
                    Object.values(node.projects).map(project => {
                      if(project.partner1 !== snapshot.val().username && project.partner2 !== snapshot.val().username){
                        if(netProjs.find(proj => proj.project.title === project.title) === undefined){
                          netProjs.push({project})
                        }
                      }
                    });
                    parents.push(node.uid);
                  }
                }
              }
            })
          }
        });
      }
      this.setState({ownProjs: ownProjs, netProjs: netProjs})
    });

  }

  componentDidMount() {
    this.props.firebase.node(this.props.firebase.auth.currentUser.uid).on('value', snapshot => {
      this.hubMount(snapshot)
    })
  }

  componentWillUnmount() {
    this.props.firebase.node().off()
    this.props.firebase.nodes().off()
  }

  render(){
    return (
      <div className="container" style={{marginTop: '0.9%', marginBottom: '1%'}}>
        <CreateProj/>
        <h3>Own Projects</h3>
        {this.state.ownProjs.length === 0 ?
          <div className="card" style={{margin: 'auto', width: "99.5%", marginTop: '1%'}}>
            <div className="container">
              <div className="card-body">
                <div className="container" align="center">
                  No projects yet.
                </div>
              </div>
            </div>
          </div>
          : <div className="row">
          {Object.values(this.state.ownProjs).map( (project, index) => {
            return <OwnProjs key={index} project={project} width={this.state.ownProjs.length === 1 ? ("65%") : ("47%") } className="col"/>
          })}
        </div>}
        <h3 style={{marginTop: '1%'}}>Network Projects</h3>
        {this.state.netProjs.length === 0 ?
          <div className="card" style={{margin: 'auto', width: "99.50%", marginTop: '1%'}}>
            <div className="container">
              <div className="card-body">
                <div className="container" align="center">
                  No projects yet.
                </div>
              </div>
            </div>
          </div>
          : <div className="row">
          {Object.values(this.state.netProjs).map( (project, index) => {
            return <NetProjs key={index} project={project} width={this.state.netProjs.length === 1 ? ("65%") : ("47%") } className="col"/>
          })}
        </div>}
      </div>
    );
  }
};

const condition = authUser => !!authUser ;
export default compose(
  withAuthorization(condition),
  withFirebase,
)(ProjectsList);