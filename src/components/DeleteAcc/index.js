import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import $ from 'jquery'

class DeleteAcc extends Component {
  _isMounted = false;
  constructor(props){
    super(props);
    this.state = {
      oldPassword: '',
      error: '',
      parent: '',
    }
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.show = this.show.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    var parent = '';
    this.props.firebase.node(this.props.firebase.auth.currentUser.uid).on("value", snapshot => {
      Object.values(snapshot.val().parents).map(parent => {
        if (new Date(parent.dateIn) <= new Date() && (parent.dateOut === '' || new Date(parent.dateOut) > new Date())){
          parent = parent.uid;
          if(this._isMounted){
            this.setState({
              parent: parent,
            })
          }
        }
      })
    });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onClick = event =>{
    this.props.firebase.node(this.state.parent).on("value", snapshot => {
      this.setState({
        username: snapshot.val().username,
      })
    });
    this.props.firebase.node(this.props.firebase.auth.currentUser.uid).on("value", user => {
      this.setState({
        username_deleted: user.val().username,
      })
    })
    const { oldPassword} = this.state;
    var cred = this.props.firebase.doGet(this.props.firebase.auth.currentUser.email, oldPassword);
    this.props.firebase.auth.currentUser.reauthenticateAndRetrieveDataWithCredential(cred).then(() => {
      this.props.firebase.auth.currentUser.delete().then(() => {
        $('#hidden-cancel').click();
        this.props.firebase.doSignOut();
      }).catch((error) => {
        this.setState({ error });
      });
      this.props.firebase.node(this.props.firebase.auth.currentUser.uid)
        .update({
          dateOut: new Date().toDateString().slice(4)
        });
      this.props.firebase.node(this.state.parent).update({
        notification: {
          uid: this.props.firebase.auth.currentUser.uid,
          username: this.state.username_deleted
        }
      })
    }).catch(error => {
      this.setState({ error });
    });
    event.preventDefault();
  }

  show(){
    $('#myModal').on('shown.bs.modal', function () {
      $('#myInput').trigger('focus')})
  }

  render() {
    const { oldPassword, error } = this.state;
    const isInvalid = oldPassword === '';
    return (
      <div style={{width: '47%', marginTop: '-6%', marginLeft: '1.5%'}}>
        <button onClick={this.show} className="btn btn-block pure-material-button-contained-2"
                data-toggle="modal" data-target="#exampleModal">
          <i className="far fa-trash-alt"> </i> Delete Account
        </button>
        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirm Delete Account</h5>
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
                         className="feather feather-key"><path
                      d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                    </svg>
                  </span>
                  </div>
                  <input
                    className="form-control input"
                    name="oldPassword"
                    value={oldPassword}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Password"
                    style={{marginLeft: '0'}}
                  />
                </div>
                <div align="center">
                  <button id="hidden-cancel" type="button" className=" mr-2 pure-material-button-contained" data-dismiss="modal">Close</button>
                  <button className="pure-material-button-contained-3 ml-2" style={{backgroundColor: 'red !important'}} type="button"
                          onClick={this.onClick} disabled={isInvalid}>Delete Account</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withFirebase(DeleteAcc);


