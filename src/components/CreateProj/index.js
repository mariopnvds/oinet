import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import $ from 'jquery';

class CreateProj extends Component {
  constructor(props){
    super(props);
    this.state = {
      options: '',
      url: '',
      partner1: '',
      partner2: '',
      title: '',
      budget: '',
      description: '',
      parents: [],
      status: '',
      error: ''
    }
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.show = this.show.bind(this);
  }

  parentSearch(snapshot){
    var options = [];
    options.push({
      username: snapshot.val().username,
      uid: snapshot.val().uid
    });
    this.props.firebase.nodes().once("value", fullNodes => {
      Object.values(fullNodes.val()).map(node => {
        if(node.parents !== "") {
          Object.values(node.parents).map(parent => {
            if(new Date(parent.dateIn) <= new Date() && (parent.dateOut === '' || new Date(parent.dateOut) > new Date())){
              if(new Date(node.dateIn) <= new Date() && (node.dateOut === '' || new Date(node.dateOut) > new Date())){
                if (parent.uid === snapshot.val().uid) {
                  options.push({
                    username: node.username,
                    uid: node.uid
                  });
                }
              }
            }
          })
        }
      });
      this.setState({options: options})
    });
  }

  componentDidMount () {
    this.props.firebase.node(this.props.firebase.auth.currentUser.uid).on('value', snapshot => {
      this.parentSearch(snapshot)
    })
  }

  componentWillUnmount() {
    this.props.firebase.nodes().off();
    this.props.firebase.node().off();
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onClick = event => {
    var uid1 = '';
    var uid2 = '';
    const { title, budget, partner1, description, status, partner2, url} = this.state;
    this.props.firebase.nodes().on('value', snapshot => Object.keys(snapshot.val()).map(key => {
      if(snapshot.val()[key].username === partner1){
        uid1 = snapshot.val()[key].uid;
        $('#hidden-cancel').click();
      }
      if(snapshot.val()[key].username === partner2){
        uid2 = snapshot.val()[key].uid;
        $('#hidden-cancel').click();
      }
    }));
    console.log(partner1, partner2)
    this.props.firebase.node(uid1).child("projects").push({
        title, budget, partner1, partner2, description, status, url
    });
    this.props.firebase.node(uid2).child("projects").push({
      title, budget, partner1, partner2, description, status, url
    });
    event.preventDefault();
  };

  show(){
    $('#myModal').on('shown.bs.modal', function () {
      $('#myInput').trigger('focus')})
  }

  render() {
    const { title, budget, description, error} = this.state;
    const isInvalid = title === '' || budget === '';
    return (
      <div style={{width: '50%', margin: 'auto', marginBottom: '1%'}}>
        <button onClick={this.show} className="btn btn-block pure-material-button-contained"
                data-toggle="modal" data-target="#exampleModal">
          <i className="far fa-plus"> </i> New Project
        </button>
        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Create new Project</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {error && ((error.message) ? (<small style={{color: 'red'}}>{error.message}</small>) : null)}
                <div className="input-group mb-2">
                  <div className="input-group-prepend">
                    <span className="input-group-text inputGroup" id="basic-addon1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className="feather feather-book">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"> </path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"> </path>
                      </svg>
                    </span>
                  </div>
                  <input
                    className="form-control input"
                    name="title"
                    value={title}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Title"
                    style={{marginLeft: '0'}}
                  />
                </div>
                <div className="input-group mb-2">
                  <div className="input-group-prepend">
                    <span className="input-group-text inputGroup" id="basic-addon1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                           className="feather feather-dollar-sign"><line x1="12" y1="1" x2="12" y2="23"> </line><path
                        d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"> </path></svg>
                    </span>
                  </div>
                  <input
                    className="form-control input"
                    name="budget"
                    value={budget}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Budget"
                    style={{marginLeft: '0'}}
                  />
                </div>
                <div className="select mb-2">
                  <select className="select-text" name="status" id="status" onChange={this.onChange} defaultValue={"none"}>
                    <option value="none" disabled>Status</option>
                    <option value="active" >Active</option>
                    <option value="finished" >Finished</option>
                  </select>
                </div>
                <div className="select mb-2">
                  <select className="select-text" name="partner1" id="partner1" onChange={this.onChange} defaultValue={"none"}>
                    <option value="none" disabled>Between ...</option>
                    {this.state.options[0] !== undefined ? <option value={this.state.options[0].username}>{this.state.options[0].username}</option> : null}
                  </select>
                </div>
                <div className="select mb-2">
                  <select className="select-text" name="partner2" id="partner2" onChange={this.onChange} defaultValue={"none"}>
                    <option value="none" disabled>and ...</option>
                    {Object.values(this.state.options).map((user, i) => <option key={i} value={user.username}>{user.username}</option>)}
                  </select>
                </div>
                <textarea value={description} placeholder="Brief Description" onChange={this.onChange} className="form-control mb-2 input" rows="2" name="description"/>
              </div>
              <div className="modal-footer">
                <button id="hidden-cancel" type="button" className="pure-material-button-contained-3" data-dismiss="modal">Close</button>
                <button className="pure-material-button-contained" type="button"
                        onClick={this.onClick} disabled={isInvalid}>Create</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withFirebase(CreateProj);


