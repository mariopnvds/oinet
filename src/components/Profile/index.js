import React from 'react';
import { compose } from 'recompose';
import withAuthorization from '../Session/withAuthorization';
import { withFirebase } from '../Firebase';


class Profile extends React.Component {
  render() {
    return (
      <div className="container mb-2">
        {/*PROFILE*/}
        <div className="card" style={{margin: 'auto', width: '99.5%', marginTop: '1%'}}>
          <div className="container">
            <div className="card-body">
              <div className="container">
                <div className="row">
                  <div className="col">
                    <h4 className=" ">Entity: <b>{this.props.location.state.username}</b></h4>
                    <h4 className="">Description: <b>{this.props.location.state.description}</b></h4>
                    <h4 className="">City: <b>{this.props.location.state.city}</b></h4>
                    <h4 className="">Country: <b>{this.props.location.state.country}</b></h4>
                    <h4 className="">Category: <b>{this.props.location.state.category}</b></h4>
                    <h4 className="">Type: <b>{this.props.location.state.type}</b></h4>
                  </div>
                  <div className="col" align="right">
                    <a className="a-edit" href={`mailto:${this.props.location.state.email}`}>
                      <i className="far fa-envelope"> </i> Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*PROJECTS*/}
        {Object.keys(this.props.location.state.projects).length === 0 ?
          <div className="card" style={{margin: 'auto', width: "50%", marginTop: '1%'}}>
            <div className="container">
              <div className="card-header">Projects</div>
              <div className="card-body">
                <div className="container" align="center">
                  No projects yet.
                </div>
              </div>
            </div>
          </div> :
          <div className="row">
            {Object.values(this.props.location.state.projects).map((project, index) => {
              return (
                <div key={index} className="card" style={{margin: 'auto', width: Object.keys(this.props.location.state.projects).length === 1 ? ("65%") : ("47%"),
                  marginTop: '1%'}}>
                  <div className="container">
                    <div className="card-body">
                      <div className="container">
                        <div className="row">
                          <div className="col">
                            <a style={{display:'inline-block', margin: '4px 0px 0px 0px'}}><b>{project.title} </b></a>
                            <p style={{margin: '4px 0', color: '#8294aa'}}>{project.partner1} - {project.partner2} </p>
                            <p style={{margin: '4px 0'}}>{project.description}</p>
                            {project.status === 'active' ?
                              <p style={{margin: '4px 0'}}>Status: <b style={{color: '#28a745'}}>{project.status}</b></p> :
                              (project.status === 'finished' ?
                                <p style={{margin: '4px 0'}}>Status: <b style={{color: '#dc3545'}}>{project.status}</b></p> :
                                null)}
                            <a>Budget: <b>{project.budget} $</b></a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        }
      </div>
    )
  }
}
const condition = authUser => !!authUser ;

export default compose(
  withAuthorization(condition),
  withFirebase,
)(Profile);